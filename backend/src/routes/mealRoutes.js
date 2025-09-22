import express from "express";
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
import { s3MealUpload } from "../middleware/s3Upload.js";

const router = express.Router();

// Meal CRUD operations
router.post("/", auth, validateMealCreation, addMeal);
router.get("/", auth, validateMealQuery, getMeals);
router.get("/stats", auth, validateMealQuery, getMealStats);
router.put("/:id", auth, validateMealId, validateMealCreation, updateMeal);
router.delete("/:id", auth, validateMealId, deleteMeal);

// Photo upload and analysis with S3
router.post("/upload", auth, ...s3MealUpload(), validateFileUpload, uploadMealPhoto);

export default router;
