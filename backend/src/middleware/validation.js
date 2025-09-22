import { body, param, query, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Meal creation validation
export const validateMealCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Meal name must be between 1 and 100 characters'),
  
  body('calories')
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Calories must be between 0 and 10000'),
  
  body('protein')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Protein must be between 0 and 1000 grams'),
  
  body('carbs')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Carbs must be between 0 and 1000 grams'),
  
  body('fat')
    .optional()
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Fat must be between 0 and 1000 grams'),
  
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'meal'])
    .withMessage('Invalid meal type'),
  
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('profile.age')
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage('Age must be between 13 and 120'),
  
  body('profile.gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),
  
  body('profile.height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),
  
  body('profile.weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),
  
  body('profile.activityLevel')
    .optional()
    .isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'])
    .withMessage('Invalid activity level'),
  
  body('profile.fitnessGoal')
    .optional()
    .isIn(['lose_weight', 'maintain_weight', 'gain_weight', 'build_muscle'])
    .withMessage('Invalid fitness goal'),
  
  handleValidationErrors
];

// Goals validation
export const validateGoals = [
  body('goals.calories')
    .optional()
    .isInt({ min: 1000, max: 5000 })
    .withMessage('Calories goal must be between 1000 and 5000'),
  
  body('goals.protein')
    .optional()
    .isInt({ min: 50, max: 300 })
    .withMessage('Protein goal must be between 50 and 300 grams'),
  
  body('goals.carbs')
    .optional()
    .isInt({ min: 100, max: 500 })
    .withMessage('Carbs goal must be between 100 and 500 grams'),
  
  body('goals.fat')
    .optional()
    .isInt({ min: 30, max: 150 })
    .withMessage('Fat goal must be between 30 and 150 grams'),
  
  body('goals.fiber')
    .optional()
    .isInt({ min: 15, max: 50 })
    .withMessage('Fiber goal must be between 15 and 50 grams'),
  
  body('goals.water')
    .optional()
    .isInt({ min: 4, max: 15 })
    .withMessage('Water goal must be between 4 and 15 glasses'),
  
  handleValidationErrors
];

// Meal ID validation
export const validateMealId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid meal ID format'),
  
  handleValidationErrors
];

// Query parameters validation
export const validateMealQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack', 'meal'])
    .withMessage('Invalid meal type'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  query('period')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Period must be day, week, or month'),
  
  handleValidationErrors
];

// File upload validation
export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded',
      error: 'Please select an image file to upload'
    });
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid file type',
      error: 'Only JPEG, PNG, and WebP images are allowed'
    });
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      message: 'File too large',
      error: 'File size must be less than 10MB'
    });
  }

  next();
};
