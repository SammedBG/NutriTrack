import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { addMeal, uploadMealPhoto, getMeals } from "../controllers/mealController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });



router.post("/", auth, addMeal);
router.get("/", auth, getMeals);
router.post("/upload", auth, upload.single("photo"), uploadMealPhoto);

export default router;
