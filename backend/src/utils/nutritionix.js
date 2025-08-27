// backend/utils/nutritionix.js
import axios from "axios";

export const analyzeFood = async (query) => {
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

  const food = res.data.foods[0];
  return {
    name: food.food_name,
    calories: food.nf_calories,
    protein: food.nf_protein,
    carbs: food.nf_total_carbohydrate,
    fat: food.nf_total_fat,
  };
};
