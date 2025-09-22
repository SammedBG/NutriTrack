import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { 
  addMeal, 
  uploadMealPhoto, 
  getMeals, 
  getMealStats, 
  updateMeal, 
  deleteMeal 
} from "../controllers/mealController.js";
import { 
  validateMealCreation, 
  validateMealId, 
  validateMealQuery,
  validateFileUpload 
} from "../middleware/validation.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Meal CRUD operations
router.post("/", auth, validateMealCreation, addMeal);
router.get("/", auth, validateMealQuery, getMeals);
router.get("/stats", auth, validateMealQuery, getMealStats);
router.put("/:id", auth, validateMealId, validateMealCreation, updateMeal);
router.delete("/:id", auth, validateMealId, deleteMeal);

// Photo upload and analysis
router.post("/upload", auth, upload.single("photo"), validateFileUpload, uploadMealPhoto);

export default router;
