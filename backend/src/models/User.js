import mongoose from "mongoose";

const GoalsSchema = new mongoose.Schema({
  goalType: { type: String, enum: ["lose", "maintain", "gain"], default: "maintain" },
  calories: { type: Number, default: 2200 },
  protein: { type: Number, default: 140 },
  carbs: { type: Number, default: 220 },
  fat: { type: Number, default: 70 }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarUrl: String,
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  height: Number,
  weight: Number,
  activityLevel: { type: String, enum: ["low","moderate","high"], default: "moderate" },
  goals: { type: GoalsSchema, default: () => ({}) },
  timezone: { type: String, default: "Asia/Kolkata" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

export default mongoose.model("User", UserSchema);
