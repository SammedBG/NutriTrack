import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "../src/config/db.js";
import authRoutes from "../src/routes/authRoutes.js";
import userRoutes from "../src/routes/userRoutes.js";
import mealRoutes from "../src/routes/mealRoutes.js";
import errorHandler from "../src/middleware/errorHandler.js";
import { generalLimiter, authLimiter, uploadLimiter, profileLimiter } from "../src/middleware/rateLimiter.js";
import { devLimiter, devUploadLimiter, devAuthLimiter } from "../src/middleware/devRateLimiter.js";

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Debug: Check if environment variables are loaded
console.log('🔍 Environment Variables Check:');
console.log('AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME || 'NOT SET');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '***SET***' : 'NOT SET');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '***SET***' : 'NOT SET');
console.log('AWS_REGION:', process.env.AWS_REGION || 'NOT SET');

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://trackapi.nutritionix.com"]
    }
  }
}));

// Rate Limiting (development-friendly)
const isDevelopment = process.env.NODE_ENV === 'development';
app.use(isDevelopment ? devLimiter : generalLimiter);

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Development-only rate limit reset endpoint
if (isDevelopment) {
  app.post('/dev/reset-rate-limit', (req, res) => {
    // This is a placeholder - in a real implementation, you'd need to clear the rate limit store
    res.json({ 
      message: 'Rate limit reset requested. Note: This requires restarting the server to fully reset.',
      timestamp: new Date().toISOString()
    });
  });
}

// Routes with specific rate limiting (development-friendly)
app.use("/api/auth", isDevelopment ? devAuthLimiter : authLimiter, authRoutes);
app.use("/api/user", profileLimiter, userRoutes);
app.use("/api/meals", isDevelopment ? devUploadLimiter : uploadLimiter, mealRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error Handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// DB + Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
