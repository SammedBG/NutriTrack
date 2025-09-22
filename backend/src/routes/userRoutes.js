import express from "express";
import auth from "../middleware/auth.js";
import { 
  getMe, 
  updateProfile, 
  uploadAvatar, 
  getUserStats, 
  deleteAccount 
} from "../controllers/userController.js";
import { 
  validateProfileUpdate, 
  validateGoals, 
  validateFileUpload 
} from "../middleware/validation.js";
import { s3AvatarUpload } from "../middleware/s3Upload.js";

const router = express.Router();

// User profile routes
router.get("/me", auth, getMe);
router.put("/me", auth, validateProfileUpdate, updateProfile);
router.put("/goals", auth, validateGoals, updateProfile);
router.get("/stats", auth, getUserStats);
router.delete("/account", auth, deleteAccount);

// Avatar upload with S3
router.post("/avatar", auth, ...s3AvatarUpload(), validateFileUpload, uploadAvatar);

export default router;
