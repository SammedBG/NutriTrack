import express from "express";
import multer from "multer";
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

const router = express.Router();

// Configure multer for avatar uploads
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// User profile routes
router.get("/me", auth, getMe);
router.put("/me", auth, validateProfileUpdate, updateProfile);
router.put("/goals", auth, validateGoals, updateProfile);
router.get("/stats", auth, getUserStats);
router.delete("/account", auth, deleteAccount);

// Avatar upload
router.post("/avatar", auth, upload.single("avatar"), validateFileUpload, uploadAvatar);

export default router;
