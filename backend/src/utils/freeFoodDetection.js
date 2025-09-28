// backend/src/utils/freeFoodDetection.js
import axios from "axios";

// Spoonacular API - Free tier: 150 requests per day
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'your_spoonacular_key_here';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Free food detection using Spoonacular API
export const detectFoodFromImage = async (imageUrl) => {
  try {
    console.log("🔍 Detecting food from image using Spoonacular API...");
    
    const response = await axios.post(
      `${SPOONACULAR_BASE_URL}/food/images/classify`,
      {
        imageUrl: imageUrl
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SPOONACULAR_API_KEY
        }
      }
    );

    if (response.data && response.data.category) {
      const detectedFood = response.data.category;
      console.log("✅ Food detected:", detectedFood);
      return {
        success: true,
        foodName: detectedFood,
        confidence: 0.8 // Spoonacular doesn't provide confidence scores
      };
    }

    throw new Error("No food detected in image");
  } catch (error) {
    console.error("❌ Spoonacular API Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get nutrition information from Spoonacular
export const getNutritionFromSpoonacular = async (foodName) => {
  try {
    console.log("🍎 Getting nutrition for:", foodName);
    
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch`,
      {
        params: {
          query: foodName,
          number: 1,
          addRecipeInformation: true,
          addRecipeNutrition: true
        },
        headers: {
          'x-api-key': SPOONACULAR_API_KEY
        }
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      const recipe = response.data.results[0];
      const nutrition = recipe.nutrition;
      
      if (nutrition && nutrition.nutrients) {
        const nutrients = nutrition.nutrients;
        
        return {
          name: recipe.title,
          calories: Math.round(nutrients.find(n => n.name === 'Calories')?.amount || 0),
          protein: Math.round(nutrients.find(n => n.name === 'Protein')?.amount || 0),
          carbs: Math.round(nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0),
          fat: Math.round(nutrients.find(n => n.name === 'Fat')?.amount || 0),
          fiber: Math.round(nutrients.find(n => n.name === 'Fiber')?.amount || 0),
          sugar: Math.round(nutrients.find(n => n.name === 'Sugar')?.amount || 0),
          sodium: Math.round(nutrients.find(n => n.name === 'Sodium')?.amount || 0),
          servingWeight: 100, // Default serving weight
          servingUnit: "g",
          servingQty: 1,
          source: "Spoonacular"
        };
      }
    }

    throw new Error("No nutrition data found");
  } catch (error) {
    console.error("❌ Spoonacular Nutrition Error:", error.message);
    return null;
  }
};

// Fallback food database for common foods
const COMMON_FOODS_DB = {
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2, sugar: 3, sodium: 551 },
  'burger': { calories: 354, protein: 16, carbs: 33, fat: 17, fiber: 2, sugar: 6, sodium: 497 },
  'salad': { calories: 20, protein: 2, carbs: 4, fat: 0, fiber: 2, sugar: 2, sodium: 10 },
  'apple': { calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, sugar: 19, sodium: 2 },
  'banana': { calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, sugar: 14, sodium: 1 },
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0, sugar: 0, sodium: 74 },
  'rice': { calories: 130, protein: 3, carbs: 28, fat: 0, fiber: 0, sugar: 0, sodium: 1 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1, fiber: 2, sugar: 1, sodium: 1 },
  'bread': { calories: 265, protein: 9, carbs: 49, fat: 3, fiber: 2, sugar: 5, sodium: 681 },
  'egg': { calories: 70, protein: 6, carbs: 0, fat: 5, fiber: 0, sugar: 0, sodium: 70 }
};

// Fallback nutrition lookup
export const getFallbackNutrition = (foodName) => {
  const normalizedName = foodName.toLowerCase().trim();
  
  // Try exact match first
  if (COMMON_FOODS_DB[normalizedName]) {
    return {
      name: foodName,
      ...COMMON_FOODS_DB[normalizedName],
      servingWeight: 100,
      servingUnit: "g",
      servingQty: 1,
      source: "Fallback DB"
    };
  }
  
  // Try partial match
  for (const [key, nutrition] of Object.entries(COMMON_FOODS_DB)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return {
        name: foodName,
        ...nutrition,
        servingWeight: 100,
        servingUnit: "g",
        servingQty: 1,
        source: "Fallback DB (partial match)"
      };
    }
  }
  
  // Default fallback
  return {
    name: foodName,
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
    source: "Default Fallback"
  };
};

// Main function that combines all approaches
export const analyzeFoodImageFree = async (imageUrl) => {
  try {
    console.log("🚀 Starting free food analysis for:", imageUrl);
    
    // Step 1: Try Spoonacular food detection
    const detection = await detectFoodFromImage(imageUrl);
    
    if (detection.success) {
      // Step 2: Get nutrition from Spoonacular
      const nutrition = await getNutritionFromSpoonacular(detection.foodName);
      
      if (nutrition) {
        console.log("✅ Successfully analyzed with Spoonacular");
        return nutrition;
      }
    }
    
    // Step 3: Fallback to common foods database
    console.log("🔄 Using fallback nutrition database");
    const fallbackNutrition = getFallbackNutrition(detection.foodName || "food item");
    
    return fallbackNutrition;
    
  } catch (error) {
    console.error("❌ Free food analysis error:", error.message);
    
    // Ultimate fallback
    return getFallbackNutrition("food item");
  }
};
