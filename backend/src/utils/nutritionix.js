// backend/utils/nutritionix.js
import axios from "axios";

export const analyzeFood = async (query) => {
  try {
  const res = await axios.post(
    "https://trackapi.nutritionix.com/v2/natural/nutrients",
    { query }, // text input, like "1 apple" or "2 eggs"
    {
      headers: {
          "x-app-id": process.env.NUTRITIONIX_APP_ID||'369c1880',
          "x-app-key": process.env.NUTRITIONIX_API_KEY||'fcbeba3b30c9b5fdd38084d859792a49',
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

// Free food recognition using Spoonacular API and fallback database
export const analyzeFoodImage = async (imageUrl) => {
  try {
    console.log("🔍 Analyzing food image with free detection system...");
    
    // Import our free food detection system
    const { analyzeFoodImageFree } = await import('./freeFoodDetection.js');
    
    // Use the free detection system
    const result = await analyzeFoodImageFree(imageUrl);
    
    if (result && result.name !== "Unknown Food Item") {
      console.log("✅ Free food detection successful:", result.name);
      return result;
    }
    
    // If free detection fails, try with Nutritionix using a generic query
    console.log("🔄 Fallback to Nutritionix with generic query");
    return await analyzeFood("food item");
    
  } catch (error) {
    console.error("❌ Free food detection error:", error.message);
    
    // Ultimate fallback to Nutritionix
    try {
      return await analyzeFood("food item");
    } catch (nutritionixError) {
      console.error("❌ Nutritionix fallback also failed:", nutritionixError.message);
      
      // Return a basic food item as last resort
      return {
        name: "Food Item",
        calories: 200,
        protein: 10,
        carbs: 25,
        fat: 8,
        fiber: 2,
        sugar: 5,
        sodium: 300,
        servingWeight: 100,
        servingUnit: "g",
        servingQty: 1,
        source: "Emergency Fallback"
      };
    }
  }
};
