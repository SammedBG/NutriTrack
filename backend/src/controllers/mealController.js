import cloudinary from "../config/cloudinary.js";
import Meal from "../models/Meal.js";
import { analyzeFood } from "../utils/nutritionix.js";

export const addMeal = async (req, res, next) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;
    const meal = await Meal.create({ user: req.user._id, name, calories, protein, carbs, fat });
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

export const uploadMealPhoto = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const nutrition = await analyzeFood(result.secure_url);
    const meal = await Meal.create({ user: req.user._id, ...nutrition, photoUrl: result.secure_url });
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    next(err);
  }
};
