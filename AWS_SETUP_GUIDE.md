# AWS S3 Setup Guide for NutriTrack

This guide will help you set up AWS S3 for cloud storage in your NutriTrack application.

## Prerequisites

1. AWS Account
2. AWS CLI installed (optional but recommended)
3. Node.js application with the updated dependencies

## Step 1: Create an S3 Bucket

### Using AWS Console:

1. **Login to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Sign in to your account

2. **Navigate to S3**
   - Search for "S3" in the services search bar
   - Click on "S3" service

3. **Create a New Bucket**
   - Click "Create bucket"
   - **Bucket name**: Choose a unique name (e.g., `nutritrack-images-2024`)
   - **Region**: Choose your preferred region (e.g., `us-east-1`)
   - **Object Ownership**: ACLs enabled (recommended)
   - **Block Public Access**: Uncheck "Block all public access" (we need public read access for images)
   - **Bucket Versioning**: Enable (optional but recommended)
   - Click "Create bucket"

### Using AWS CLI:

```bash
aws s3 mb s3://your-bucket-name --region us-east-1
aws s3api put-bucket-versioning --bucket your-bucket-name --versioning-configuration Status=Enabled
```

## Step 2: Configure Bucket Policy

### Public Read Access Policy:

1. **Go to your bucket**
2. **Click on "Permissions" tab**
3. **Scroll down to "Bucket policy"**
4. **Add this policy** (replace `YOUR_BUCKET_NAME` with your actual bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## Step 3: Create IAM User and Access Keys

### Create IAM User:

1. **Navigate to IAM**
   - Search for "IAM" in AWS Console
   - Click on "IAM" service

2. **Create New User**
   - Click "Users" in the left sidebar
   - Click "Create user"
   - **User name**: `nutritrack-s3-user`
   - **Access type**: Programmatic access
   - Click "Next"

3. **Attach Policies**
   - Click "Attach existing policies directly"
   - Search for and select: `AmazonS3FullAccess`
   - Click "Next" and then "Create user"

4. **Save Access Keys**
   - **Important**: Download or copy the Access Key ID and Secret Access Key
   - You'll need these for your environment variables

### Alternative: Create Custom Policy (More Secure)

Instead of `AmazonS3FullAccess`, create a custom policy with minimal permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
        }
    ]
}
```

## Step 4: Configure Environment Variables

Create a `.env` file in your backend directory with these variables:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_S3_BUCKET_NAME=your-bucket-name

# Other existing variables...
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
NUTRITIONIX_APP_ID=your_nutritionix_app_id
NUTRITIONIX_API_KEY=your_nutritionix_api_key
```

## Step 5: Install Dependencies

Make sure you have the updated dependencies in your `package.json`:

```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer-s3 uuid
```

## Step 6: Test the Setup

### Test S3 Connection:

Create a simple test script to verify your S3 setup:

```javascript
// test-s3.js
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3Connection() {
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log('✅ S3 Connection successful!');
    console.log('Available buckets:', response.Buckets.map(b => b.Name));
  } catch (error) {
    console.error('❌ S3 Connection failed:', error.message);
  }
}

testS3Connection();
```

Run the test:
```bash
node test-s3.js
```

## Step 7: Optional - Set up CloudFront CDN

For better performance and global distribution:

1. **Create CloudFront Distribution**
   - Go to CloudFront in AWS Console
   - Click "Create distribution"
   - **Origin Domain**: Select your S3 bucket
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
   - **Cache Policy**: CachingDisabled (for dynamic content)
   - Click "Create distribution"

2. **Update Environment Variables**
   ```env
   AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
   ```

## Step 8: Security Best Practices

### 1. Bucket Security:
- Enable versioning
- Enable server-side encryption
- Set up lifecycle policies for old versions
- Monitor access with CloudTrail

### 2. IAM Security:
- Use least privilege principle
- Rotate access keys regularly
- Enable MFA for IAM users
- Use IAM roles when possible

### 3. Application Security:
- Never commit access keys to version control
- Use environment variables
- Implement proper error handling
- Add request validation

## Step 9: Monitoring and Costs

### CloudWatch Monitoring:
- Set up S3 metrics
- Monitor API calls
- Set up billing alerts

### Cost Optimization:
- Use S3 Intelligent Tiering
- Set up lifecycle policies
- Monitor data transfer costs
- Use appropriate storage classes

## Troubleshooting

### Common Issues:

1. **Access Denied Error**
   - Check IAM permissions
   - Verify bucket policy
   - Ensure access keys are correct

2. **CORS Issues**
   - Configure CORS policy on S3 bucket
   - Add your domain to allowed origins

3. **File Upload Failures**
   - Check file size limits
   - Verify MIME types
   - Check network connectivity

### CORS Configuration:

Add this CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

## Migration from Cloudinary

If you're migrating from Cloudinary:

1. **Export existing images** from Cloudinary
2. **Upload to S3** using the migration script
3. **Update database** with new S3 URLs
4. **Test thoroughly** before removing Cloudinary

## Support

For issues with AWS S3 setup:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
- [AWS Support](https://aws.amazon.com/support/)

---

**Note**: Always follow AWS security best practices and keep your access keys secure!
