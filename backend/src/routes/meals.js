import express from "express";
import requireAuth from "../middleware/auth.js";
import { createMeal, ingestMeal, listMeals, updateMealItems } from "../controllers/mealController.js";

const router = express.Router();

router.post("/", requireAuth, createMeal);
router.post("/:id/ingest", requireAuth, ingestMeal);
router.get("/", requireAuth, listMeals);
router.put("/:id/items", requireAuth, updateMealItems);

export default router;
