// Utility functions for exporting user data

export const exportToCSV = (data, filename = 'nutritrack-data.csv') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data, filename = 'nutritrack-data.json') => {
  if (!data) {
    throw new Error('No data to export');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportMealsToCSV = (meals) => {
  if (!meals || meals.length === 0) {
    throw new Error('No meals to export');
  }

  const formattedMeals = meals.map(meal => ({
    'Date': new Date(meal.createdAt).toLocaleDateString(),
    'Time': new Date(meal.createdAt).toLocaleTimeString(),
    'Meal Type': meal.mealType || 'meal',
    'Food Name': meal.name || 'Unknown',
    'Calories': meal.calories || 0,
    'Protein (g)': meal.protein || 0,
    'Carbs (g)': meal.carbs || 0,
    'Fat (g)': meal.fat || 0,
    'Fiber (g)': meal.fiber || 0,
    'Sugar (g)': meal.sugar || 0,
    'Sodium (mg)': meal.sodium || 0,
    'Serving Size': meal.servingQty || 1,
    'Serving Unit': meal.servingUnit || 'serving',
    'Confidence': meal.confidence ? `${Math.round(meal.confidence * 100)}%` : 'N/A',
    'Verified': meal.isVerified ? 'Yes' : 'No',
    'Photo URL': meal.photoUrl || 'N/A'
  }));

  exportToCSV(formattedMeals, `nutritrack-meals-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportUserStatsToJSON = (user, stats, meals) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
      profile: user.profile,
      goals: user.goals,
      preferences: user.preferences,
      streak: user.streak,
      joinDate: user.createdAt
    },
    statistics: {
      totalMeals: meals.length,
      totalCalories: stats.totalCalories || 0,
      totalProtein: stats.totalProtein || 0,
      totalCarbs: stats.totalCarbs || 0,
      totalFat: stats.totalFat || 0,
      averageCaloriesPerMeal: stats.avgCaloriesPerMeal || 0,
      averageProteinPerMeal: stats.avgProteinPerMeal || 0
    },
    meals: meals.map(meal => ({
      date: meal.createdAt,
      name: meal.name,
      mealType: meal.mealType,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      sugar: meal.sugar,
      sodium: meal.sodium,
      confidence: meal.confidence,
      isVerified: meal.isVerified,
      photoUrl: meal.photoUrl
    }))
  };

  exportToJSON(exportData, `nutritrack-export-${new Date().toISOString().split('T')[0]}.json`);
};

export const generateNutritionReport = (meals, userGoals) => {
  if (!meals || meals.length === 0) {
    throw new Error('No meals to generate report for');
  }

  // Calculate totals
  const totals = meals.reduce((acc, meal) => {
    acc.calories += meal.calories || 0;
    acc.protein += meal.protein || 0;
    acc.carbs += meal.carbs || 0;
    acc.fat += meal.fat || 0;
    acc.fiber += meal.fiber || 0;
    acc.sugar += meal.sugar || 0;
    acc.sodium += meal.sodium || 0;
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  });

  // Calculate averages
  const averages = {
    calories: Math.round(totals.calories / meals.length),
    protein: Math.round(totals.protein / meals.length),
    carbs: Math.round(totals.carbs / meals.length),
    fat: Math.round(totals.fat / meals.length),
    fiber: Math.round(totals.fiber / meals.length),
    sugar: Math.round(totals.sugar / meals.length),
    sodium: Math.round(totals.sodium / meals.length)
  };

  // Goal achievement percentages
  const goalAchievement = {
    calories: userGoals?.calories ? Math.round((totals.calories / userGoals.calories) * 100) : 0,
    protein: userGoals?.protein ? Math.round((totals.protein / userGoals.protein) * 100) : 0,
    carbs: userGoals?.carbs ? Math.round((totals.carbs / userGoals.carbs) * 100) : 0,
    fat: userGoals?.fat ? Math.round((totals.fat / userGoals.fat) * 100) : 0
  };

  // Meal type breakdown
  const mealTypeBreakdown = meals.reduce((acc, meal) => {
    const type = meal.mealType || 'meal';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const report = {
    reportDate: new Date().toISOString(),
    period: {
      startDate: new Date(Math.min(...meals.map(m => new Date(m.createdAt)))).toISOString(),
      endDate: new Date(Math.max(...meals.map(m => new Date(m.createdAt)))).toISOString(),
      totalDays: Math.ceil((new Date(Math.max(...meals.map(m => new Date(m.createdAt)))) - new Date(Math.min(...meals.map(m => new Date(m.createdAt))))) / (1000 * 60 * 60 * 24)) + 1
    },
    summary: {
      totalMeals: meals.length,
      totals,
      averages,
      goalAchievement,
      mealTypeBreakdown
    },
    insights: [
      `You logged ${meals.length} meals over ${Math.ceil((new Date(Math.max(...meals.map(m => new Date(m.createdAt)))) - new Date(Math.min(...meals.map(m => new Date(m.createdAt))))) / (1000 * 60 * 60 * 24)) + 1} days`,
      `Average calories per meal: ${averages.calories}`,
      `Protein goal achievement: ${goalAchievement.protein}%`,
      `Most common meal type: ${Object.keys(mealTypeBreakdown).reduce((a, b) => mealTypeBreakdown[a] > mealTypeBreakdown[b] ? a : b)}`
    ]
  };

  return report;
};

export const exportNutritionReport = (meals, userGoals) => {
  const report = generateNutritionReport(meals, userGoals);
  exportToJSON(report, `nutritrack-report-${new Date().toISOString().split('T')[0]}.json`);
};

// Helper function to download files
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

// Helper function to format data for different export types
export const formatDataForExport = (data, format = 'csv') => {
  switch (format.toLowerCase()) {
    case 'csv':
      return data;
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'excel':
      // For Excel export, you might want to use a library like xlsx
      return data;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
