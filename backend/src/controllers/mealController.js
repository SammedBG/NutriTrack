import Meal from "../models/Meal.js";
import { analyzeFood, analyzeFoodImage } from "../utils/nutritionix.js";
import { deleteFromS3, extractS3Key } from "../config/aws.js";

export const addMeal = async (req, res, next) => {
  try {
    const { 
      name, 
      calories, 
      protein, 
      carbs, 
      fat, 
      fiber, 
      sugar, 
      sodium, 
      servingWeight, 
      servingUnit, 
      servingQty,
      mealType 
    } = req.body;
    
    const meal = await Meal.create({ 
      user: req.user._id, 
      name, 
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      fiber: parseFloat(fiber) || 0,
      sugar: parseFloat(sugar) || 0,
      sodium: parseFloat(sodium) || 0,
      servingWeight: parseFloat(servingWeight) || 0,
      servingUnit: servingUnit || "serving",
      servingQty: parseFloat(servingQty) || 1,
      mealType: mealType || "meal",
      isVerified: true
    });
    
    res.json(meal);
  } catch (err) {
    next(err);
  }
};

export const uploadMealPhoto = async (req, res, next) => {
  try {
    if (!req.file && !req.s3File) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Get the S3 file URL from middleware
    const photoUrl = req.s3File.url;
    const s3Key = req.s3File.key;

    // Analyze the food image with fallback
    let nutrition;
    let confidence = 0.5; // Default confidence
    
    try {
      nutrition = await analyzeFoodImage(photoUrl);
      confidence = 0.8; // Higher confidence if analysis succeeds
    } catch (analysisError) {
      console.error("Food analysis failed, using fallback:", analysisError.message);
      // Fallback to basic food item
      nutrition = {
        name: "Food Item",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        servingWeight: 0,
        servingUnit: "serving",
        servingQty: 1,
      };
      confidence = 0.3; // Lower confidence for fallback
    }

    // Create meal with confidence score
    const meal = await Meal.create({
      user: req.user._id,
      ...nutrition,
      photoUrl: photoUrl,
      s3Key: s3Key, // Store S3 key for future deletion
      confidence: confidence,
      mealType: req.body.mealType || "meal"
    });

    res.json({
      ...meal.toObject(),
      analysis: {
        confidence: meal.confidence,
        message: confidence > 0.7 
          ? "Food analyzed successfully! Please verify the details below."
          : "Image uploaded successfully! Please manually enter the food details."
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      mealType, 
      startDate, 
      endDate 
    } = req.query;

    const query = { user: req.user._id };
    
    if (mealType) {
      query.mealType = mealType;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const meals = await Meal.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meal.countDocuments(query);

    res.json({
      meals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMealStats = async (req, res, next) => {
  try {
    const { period = 'week' } = req.query;
    const userId = req.user._id;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    const meals = await Meal.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const stats = meals.reduce((acc, meal) => {
      acc.totalCalories += meal.calories || 0;
      acc.totalProtein += meal.protein || 0;
      acc.totalCarbs += meal.carbs || 0;
      acc.totalFat += meal.fat || 0;
      acc.totalFiber += meal.fiber || 0;
      acc.mealCount += 1;
      return acc;
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      totalFiber: 0,
      mealCount: 0
    });

    // Calculate averages
    if (stats.mealCount > 0) {
      stats.avgCaloriesPerMeal = Math.round(stats.totalCalories / stats.mealCount);
      stats.avgProteinPerMeal = Math.round(stats.totalProtein / stats.mealCount);
    }

    res.json({
      period,
      startDate,
      endDate,
      stats,
      userGoals: req.user.goals
    });
  } catch (err) {
    next(err);
  }
};

export const updateMeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const meal = await Meal.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { ...updateData, isVerified: true },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.json(meal);
  } catch (err) {
    next(err);
  }
};

export const deleteMeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findOne({ _id: id, user: req.user._id });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Delete from S3 if meal has a photo
    if (meal.s3Key) {
      const deleteResult = await deleteFromS3(meal.s3Key);
      if (!deleteResult.success) {
        console.error('Failed to delete S3 file:', deleteResult.error);
        // Continue with meal deletion even if S3 deletion fails
      }
    }

    // Delete meal from database
    await Meal.findByIdAndDelete(id);

    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    next(err);
  }
};
