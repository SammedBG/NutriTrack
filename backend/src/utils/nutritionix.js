// backend/utils/nutritionix.js
import axios from "axios";

export const analyzeFood = async (query) => {
  try {
    const res = await axios.post(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      { query }, // text input, like "1 apple" or "2 eggs"
      {
        headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID,
          "x-app-key": process.env.NUTRITIONIX_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data.foods || res.data.foods.length === 0) {
      throw new Error("No food items found");
    }

    const food = res.data.foods[0];
    return {
      name: food.food_name,
      calories: Math.round(food.nf_calories || 0),
      protein: Math.round(food.nf_protein || 0),
      carbs: Math.round(food.nf_total_carbohydrate || 0),
      fat: Math.round(food.nf_total_fat || 0),
      fiber: Math.round(food.nf_dietary_fiber || 0),
      sugar: Math.round(food.nf_sugars || 0),
      sodium: Math.round(food.nf_sodium || 0),
      servingWeight: Math.round(food.serving_weight_grams || 0),
      servingUnit: food.serving_unit || "serving",
      servingQty: food.serving_qty || 1,
    };
  } catch (error) {
    console.error("Nutritionix API Error:", error.message);
    // Return default values if API fails
    return {
      name: "Unknown Food Item",
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
  }
};

// Enhanced food recognition using Google Vision API
export const analyzeFoodImage = async (imageUrl) => {
  try {
    // This would integrate with Google Vision API for food recognition
    // For now, we'll use a placeholder that could be enhanced
    const vision = require('@google-cloud/vision');
    const client = new vision.ImageAnnotatorClient();
    
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;
    
    // Look for food-related labels
    const foodLabels = labels
      .filter(label => label.description.toLowerCase().includes('food') || 
                     label.description.toLowerCase().includes('meal') ||
                     label.description.toLowerCase().includes('dish'))
      .map(label => label.description);
    
    if (foodLabels.length > 0) {
      // Use the most confident food label for analysis
      const foodQuery = foodLabels[0];
      return await analyzeFood(foodQuery);
    }
    
    // Fallback to generic food analysis
    return await analyzeFood("food item");
  } catch (error) {
    console.error("Vision API Error:", error.message);
    // Fallback to basic analysis
    return await analyzeFood("food item");
  }
};
