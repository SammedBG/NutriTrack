import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: "" },

  // fitness profile
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  height: Number, // cm
  weight: Number, // kg
  activityLevel: { type: String, enum: ["low", "moderate", "high"], default: "moderate" },

  goals: {
    goalType: { type: String, enum: ["lose", "maintain", "gain"], default: "maintain" },
    calories: { type: Number, default: 2200 },
    protein: { type: Number, default: 140 },
    carbs: { type: Number, default: 220 },
    fat: { type: Number, default: 70 },
  },

  timezone: { type: String, default: "Asia/Kolkata" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
});

export default mongoose.model("User", UserSchema);
