import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    servingWeight: { type: Number, default: 0 },
    servingUnit: { type: String, default: "serving" },
    servingQty: { type: Number, default: 1 },
    photoUrl: String,
    mealType: { 
      type: String, 
      enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
      default: 'meal' 
    },
    confidence: { type: Number, default: 0 }, // AI confidence score
    isVerified: { type: Boolean, default: false }, // User verified the analysis
  },
  { timestamps: true }
);

// Index for efficient queries
mealSchema.index({ user: 1, createdAt: -1 });
mealSchema.index({ user: 1, mealType: 1, createdAt: -1 });

export default mongoose.model("Meal", mealSchema);
