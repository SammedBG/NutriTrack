import multer from 'multer';
import { uploadToS3 } from '../config/aws.js';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

// Middleware to upload to S3 after multer processing
export const uploadToS3Middleware = (folder = 'uploads') => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      // Upload to S3
      const result = await uploadToS3(req.file, folder);
      
      if (!result.success) {
        return res.status(500).json({
          message: 'File upload failed',
          error: result.error,
        });
      }

      // Add S3 info to request
      req.s3File = {
        url: result.url,
        key: result.key,
        originalName: result.originalName,
      };

      next();
    } catch (error) {
      console.error('S3 Upload Middleware Error:', error);
      res.status(500).json({
        message: 'File upload failed',
        error: error.message,
      });
    }
  };
};

// Combined middleware for file upload
export const s3Upload = (folder = 'uploads') => [
  upload.single('photo'),
  uploadToS3Middleware(folder),
];

// Avatar upload middleware
export const s3AvatarUpload = () => [
  upload.single('avatar'),
  uploadToS3Middleware('avatars'),
];

// Meal photo upload middleware
export const s3MealUpload = () => [
  upload.single('photo'),
  uploadToS3Middleware('meals'),
];

export default upload;
