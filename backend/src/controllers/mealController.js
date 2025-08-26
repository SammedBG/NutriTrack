import Meal from "../models/meal.js";
import { getSignedUpload, uploadImageBuffer } from "../services/storage.js";
import { classifyImageAndEstimate } from "../services/ml.js";

/**
 * Create meal (metadata) — returns meal and upload info
 */
export async function createMeal(req, res, next) {
  try {
    const { takenAt, source } = req.body;
    const meal = await Meal.create({ userId: req.userId, takenAt: takenAt ? new Date(takenAt) : new Date(), source: source || "IMAGE" });
    // get signed upload URL or signature to client
    // stub: we return an upload path and public url pattern
    const { uploadUrl, publicUrl } = await getSignedUpload(req.userId, meal._id);
    // save photoUrl (public) right away
    await meal.updateOne({ $set: { photoUrl: publicUrl } });
    res.json({ mealId: meal._id, uploadUrl, publicUrl });
  } catch (err) { next(err); }
}

export async function ingestMeal(req, res, next) {
  try {
    const mealId = req.params.id;
    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ error: "Meal not found" });

    // call ML service to classify image and estimate nutrition
    const items = await classifyImageAndEstimate(meal.photoUrl);
    // update meal with generated items (but mark as draft — user can edit later)
    meal.items = items;
    await meal.save();
    res.json({ items });
  } catch (err) { next(err); }
}

export async function listMeals(req, res, next) {
  try {
    const { from, to } = req.query;
    const q = { userId: req.userId };
    if (from || to) {
      q.takenAt = {};
      if (from) q.takenAt.$gte = new Date(from);
      if (to) q.takenAt.$lte = new Date(to);
    }
    const meals = await Meal.find(q).sort({ takenAt: -1 });
    res.json({ meals });
  } catch (err) { next(err); }
}

export async function updateMealItems(req, res, next) {
  try {
    const mealId = req.params.id;
    const { items, notes } = req.body;
    const meal = await Meal.findByIdAndUpdate(mealId, { $set: { items, notes } }, { new: true });
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json({ meal });
  } catch (err) { next(err); }
}
