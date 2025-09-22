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
router.post("/", auth, addMeal);
router.get("/", auth, getMeals);
router.get("/stats", auth, getMealStats);
router.put("/:id", auth, updateMeal);
router.delete("/:id", auth, deleteMeal);

// Photo upload and analysis
router.post("/upload", auth, upload.single("photo"), uploadMealPhoto);

export default router;
