import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Download image from URL and upload to S3
 */
async function migrateImageToS3(imageUrl, folder = 'migrated') {
  try {
    console.log(`Migrating image: ${imageUrl}`);
    
    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });

    // Generate unique filename
    const fileExtension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    
    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(response.data),
      ContentType: response.headers['content-type'] || 'image/jpeg',
      ACL: 'public-read',
      Metadata: {
        originalUrl: imageUrl,
        migratedAt: new Date().toISOString(),
      },
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return new S3 URL
    const newUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
    
    console.log(`✅ Migrated: ${imageUrl} -> ${newUrl}`);
    
    return {
      success: true,
      originalUrl: imageUrl,
      newUrl: newUrl,
      s3Key: fileName,
    };
  } catch (error) {
    console.error(`❌ Failed to migrate ${imageUrl}:`, error.message);
    return {
      success: false,
      originalUrl: imageUrl,
      error: error.message,
    };
  }
}

/**
 * Migrate all meal photos from Cloudinary to S3
 */
async function migrateMealPhotos() {
  try {
    console.log('🔄 Starting meal photos migration...');
    
    // Import models
    const mongoose = await import('mongoose');
    const Meal = (await import('../models/Meal.js')).default;
    
    // Connect to database
    await mongoose.default.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find all meals with photoUrl
    const meals = await Meal.find({ 
      photoUrl: { $exists: true, $ne: null, $ne: '' },
      s3Key: { $exists: false } // Only migrate meals that haven't been migrated
    });
    
    console.log(`📊 Found ${meals.length} meals to migrate`);
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };
    
    // Process meals in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < meals.length; i += batchSize) {
      const batch = meals.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(meals.length / batchSize)}`);
      
      const batchPromises = batch.map(async (meal) => {
        const result = await migrateImageToS3(meal.photoUrl, 'meals');
        
        if (result.success) {
          // Update meal with new S3 URL and key
          await Meal.findByIdAndUpdate(meal._id, {
            photoUrl: result.newUrl,
            s3Key: result.s3Key,
          });
          
          results.successful++;
          console.log(`✅ Updated meal ${meal._id}`);
        } else {
          results.failed++;
          results.errors.push({
            mealId: meal._id,
            originalUrl: meal.photoUrl,
            error: result.error,
          });
          console.log(`❌ Failed to update meal ${meal._id}`);
        }
      });
      
      await Promise.all(batchPromises);
      
      // Add delay between batches to be respectful to external services
      if (i + batchSize < meals.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successful: ${results.successful}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => {
        console.log(`  - Meal ${error.mealId}: ${error.error}`);
      });
    }
    
    return results;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Migrate all user avatars from Cloudinary to S3
 */
async function migrateUserAvatars() {
  try {
    console.log('🔄 Starting user avatars migration...');
    
    // Import models
    const mongoose = await import('mongoose');
    const User = (await import('../models/User.js')).default;
    
    // Connect to database
    await mongoose.default.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find all users with avatars
    const users = await User.find({ 
      avatar: { $exists: true, $ne: null, $ne: '' },
      avatarS3Key: { $exists: false } // Only migrate users that haven't been migrated
    });
    
    console.log(`📊 Found ${users.length} users to migrate`);
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
    };
    
    // Process users
    for (const user of users) {
      const result = await migrateImageToS3(user.avatar, 'avatars');
      
      if (result.success) {
        // Update user with new S3 URL and key
        await User.findByIdAndUpdate(user._id, {
          avatar: result.newUrl,
          avatarS3Key: result.s3Key,
        });
        
        results.successful++;
        console.log(`✅ Updated user ${user._id}`);
      } else {
        results.failed++;
        results.errors.push({
          userId: user._id,
          originalUrl: user.avatar,
          error: result.error,
        });
        console.log(`❌ Failed to update user ${user._id}`);
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 Avatar Migration Summary:');
    console.log(`✅ Successful: ${results.successful}`);
    console.log(`❌ Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => {
        console.log(`  - User ${error.userId}: ${error.error}`);
      });
    }
    
    return results;
  } catch (error) {
    console.error('❌ Avatar migration failed:', error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  try {
    console.log('🚀 Starting NutriTrack S3 Migration');
    console.log('=====================================');
    
    // Check environment variables
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      throw new Error('Missing required AWS environment variables');
    }
    
    if (!process.env.MONGO_URI) {
      throw new Error('Missing MONGO_URI environment variable');
    }
    
    console.log('✅ Environment variables validated');
    
    // Run migrations
    const mealResults = await migrateMealPhotos();
    const avatarResults = await migrateUserAvatars();
    
    console.log('\n🎉 Migration Complete!');
    console.log('======================');
    console.log(`Meal Photos: ${mealResults.successful} successful, ${mealResults.failed} failed`);
    console.log(`User Avatars: ${avatarResults.successful} successful, ${avatarResults.failed} failed`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { migrateImageToS3, migrateMealPhotos, migrateUserAvatars, runMigration };
