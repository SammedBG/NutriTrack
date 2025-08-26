import mongoose from "mongoose";

const MealItemSchema = new mongoose.Schema({
  foodName: String,
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: "serving" },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  confidence: Number,
  foodRefId: String
}, { _id: false });

const MealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  takenAt: { type: Date, default: Date.now },
  photoUrl: String,
  source: { type: String, enum: ["IMAGE", "BARCODE", "MANUAL"], default: "IMAGE" },
  items: [MealItemSchema],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Meal", MealSchema);
