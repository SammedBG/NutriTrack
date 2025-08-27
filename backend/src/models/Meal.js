import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    photoUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);
