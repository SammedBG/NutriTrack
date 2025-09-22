import User from "../models/User.js";
import { deleteFromS3, extractS3Key } from "../config/aws.js";

export const getMe = async (req, res) => {
  try {
    // Update user streak on login
    await req.user.updateStreak();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { 
      name, 
      profile, 
      goals, 
      preferences 
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (profile) updateData.profile = { ...req.user.profile, ...profile };
    if (goals) updateData.goals = { ...req.user.goals, ...goals };
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file && !req.s3File) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Get the S3 file URL from middleware
    const avatarUrl = req.s3File.url;
    const s3Key = req.s3File.key;

    // Delete old avatar from S3 if exists
    if (req.user.avatar) {
      const oldS3Key = extractS3Key(req.user.avatar);
      if (oldS3Key) {
        await deleteFromS3(oldS3Key);
      }
    }

    // Update user avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: avatarUrl,
        avatarS3Key: s3Key // Store S3 key for future deletion
      },
      { new: true }
    );

    res.json({ avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Get user's meal statistics
    const Meal = require("../models/Meal.js").default;
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayMeals, weekMeals, monthMeals] = await Promise.all([
      Meal.find({ user: userId, createdAt: { $gte: startOfDay } }),
      Meal.find({ user: userId, createdAt: { $gte: startOfWeek } }),
      Meal.find({ user: userId, createdAt: { $gte: startOfMonth } })
    ]);

    const calculateStats = (meals) => {
      return meals.reduce((acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.carbs += meal.carbs || 0;
        acc.fat += meal.fat || 0;
        acc.fiber += meal.fiber || 0;
        acc.mealCount += 1;
        return acc;
      }, {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        mealCount: 0
      });
    };

    const stats = {
      today: calculateStats(todayMeals),
      week: calculateStats(weekMeals),
      month: calculateStats(monthMeals),
      streak: req.user.streak,
      goals: req.user.goals
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Verify password before deletion
    const isMatch = await req.user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Delete user's avatar from S3 if exists
    if (req.user.avatarS3Key) {
      await deleteFromS3(req.user.avatarS3Key);
    }

    // Get all user's meals to delete their photos from S3
    const Meal = require("../models/Meal.js").default;
    const userMeals = await Meal.find({ user: req.user._id });
    
    // Delete all meal photos from S3
    const s3DeletePromises = userMeals
      .filter(meal => meal.s3Key)
      .map(meal => deleteFromS3(meal.s3Key));
    
    await Promise.all(s3DeletePromises);

    // Delete user and all associated data
    await Promise.all([
      User.findByIdAndDelete(req.user._id),
      Meal.deleteMany({ user: req.user._id })
    ]);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
