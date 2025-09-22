import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Upload file to S3
export const uploadToS3 = async (file, folder = 'uploads') => {
  try {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
    
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Make files publicly accessible
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      },
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // Return the public URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
    
    return {
      success: true,
      url: fileUrl,
      key: fileName,
      originalName: file.originalname,
    };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete file from S3
export const deleteFromS3 = async (fileKey) => {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('S3 Delete Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate presigned URL for secure uploads (optional)
export const generatePresignedUrl = async (fileName, contentType, folder = 'uploads') => {
  try {
    const key = `${folder}/${uuidv4()}-${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    
    return {
      success: true,
      presignedUrl,
      key,
      publicUrl: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error('Presigned URL Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get file from S3 (for private files)
export const getFromS3 = async (fileKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const response = await s3Client.send(command);
    return {
      success: true,
      data: response.Body,
      contentType: response.ContentType,
    };
  } catch (error) {
    console.error('S3 Get Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Extract S3 key from URL
export const extractS3Key = (url) => {
  if (!url) return null;
  
  const urlParts = url.split('/');
  const bucketIndex = urlParts.findIndex(part => part.includes('.s3.'));
  
  if (bucketIndex === -1) return null;
  
  return urlParts.slice(bucketIndex + 1).join('/');
};

export default s3Client;
