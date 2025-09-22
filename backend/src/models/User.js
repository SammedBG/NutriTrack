import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
        name: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        avatar: { type: String }, // URL to profile picture
        avatarS3Key: { type: String }, // S3 key for avatar file management
    goals: {
      calories: { type: Number, default: 2000, min: 1000, max: 5000 },
      protein: { type: Number, default: 100, min: 50, max: 300 },
      carbs: { type: Number, default: 250, min: 100, max: 500 },
      fat: { type: Number, default: 80, min: 30, max: 150 },
      fiber: { type: Number, default: 25, min: 15, max: 50 },
      water: { type: Number, default: 8, min: 4, max: 15 }, // glasses per day
    },
    profile: {
      age: { type: Number, min: 13, max: 120 },
      gender: { type: String, enum: ['male', 'female', 'other'] },
      height: { type: Number, min: 100, max: 250 }, // cm
      weight: { type: Number, min: 30, max: 300 }, // kg
      activityLevel: { 
        type: String, 
        enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
        default: 'moderately_active'
      },
      fitnessGoal: { 
        type: String, 
        enum: ['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle'],
        default: 'maintain_weight'
      }
    },
    preferences: {
      units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
      notifications: {
        mealReminders: { type: Boolean, default: true },
        goalAlerts: { type: Boolean, default: true },
        weeklyReports: { type: Boolean, default: true }
      },
      privacy: {
        shareProgress: { type: Boolean, default: false },
        publicProfile: { type: Boolean, default: false }
      }
    },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    streak: { type: Number, default: 0 }, // days of consecutive logging
  },
  { timestamps: true }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastLogin = this.lastLogin ? new Date(this.lastLogin) : null;
  
  if (!lastLogin) {
    this.streak = 1;
  } else {
    const diffTime = today - lastLogin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streak += 1;
    } else if (diffDays > 1) {
      this.streak = 1;
    }
  }
  
  this.lastLogin = today;
  return this.save();
};

export default mongoose.model("User", userSchema);
