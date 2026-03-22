const { validationResult, body, param, query } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Auth validators
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

// Board validators
const validateBoardCreate = [
  body('name').trim().notEmpty().withMessage('Board name is required'),
  handleValidationErrors
];

const validateColumnCreate = [
  body('name').trim().notEmpty().withMessage('Column name is required'),
  handleValidationErrors
];

const validateColumnUpdate = [
  body('name').trim().notEmpty().withMessage('Column name is required'),
  param('columnId').isInt().withMessage('Invalid column ID'),
  handleValidationErrors
];

// Task validators
const validateTaskCreate = [
  param('columnId').isInt().withMessage('Column ID must be a number'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  handleValidationErrors
];

const validateTaskUpdate = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  param('taskId').isInt().withMessage('Invalid task ID'),
  handleValidationErrors
];

const validateTaskReorder = [
  body('position').isInt({ min: 0 }).withMessage('Position must be a non-negative integer'),
  param('taskId').isInt().withMessage('Invalid task ID'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateBoardCreate,
  validateColumnCreate,
  validateColumnUpdate,
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskReorder
};
