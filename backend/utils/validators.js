const { body, param, query, validationResult } = require('express-validator');

// Validate job creation
const validateJobCreation = [
  body('jobTitle')
    .notEmpty().withMessage('Job title is required')
    .trim()
    .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),
  
  body('company')
    .notEmpty().withMessage('Company name is required')
    .trim(),
  
  body('specialization')
    .notEmpty().withMessage('Specialization is required')
    .isIn([
      'Software Engineering', 'Web Development', 'Mobile Development',
      'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing',
      'Cybersecurity', 'UI/UX Design', 'Product Management', 'Quality Assurance',
      'IT Support', 'Network Administration', 'Database Administration', 'Other'
    ]).withMessage('Invalid specialization'),
  
  body('requirements')
    .notEmpty().withMessage('Requirements are required')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .trim(),
  
  body('location.city')
    .notEmpty().withMessage('City is required')
    .trim(),
  
  body('applicationDeadline')
    .notEmpty().withMessage('Application deadline is required')
    .isISO8601().withMessage('Invalid date format')
    .custom(value => {
      const deadlineDate = new Date(value);
      const currentDate = new Date();
      if (deadlineDate <= currentDate) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
  
  body('positionsAvailable')
    .optional()
    .isInt({ min: 1 }).withMessage('Positions must be at least 1'),
  
  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];

// Validate job update
const validateJobUpdate = [
  param('id')
    .isMongoId().withMessage('Invalid job ID'),
  
  body('jobTitle')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),
  
  body('specialization')
    .optional()
    .isIn([
      'Software Engineering', 'Web Development', 'Mobile Development',
      'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing',
      'Cybersecurity', 'UI/UX Design', 'Product Management', 'Quality Assurance',
      'IT Support', 'Network Administration', 'Database Administration', 'Other'
    ]).withMessage('Invalid specialization'),
  
  body('requirements')
    .optional()
    .trim(),
  
  body('description')
    .optional()
    .trim(),
  
  body('location.city')
    .optional()
    .trim(),
  
  body('applicationDeadline')
    .optional()
    .isISO8601().withMessage('Invalid date format')
    .custom(value => {
      const deadlineDate = new Date(value);
      const currentDate = new Date();
      if (deadlineDate <= currentDate) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['active', 'filled', 'expired', 'draft']).withMessage('Invalid status'),
  
  body('positionsAvailable')
    .optional()
    .isInt({ min: 1 }).withMessage('Positions must be at least 1'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];

// Validate search and filter
const validateSearchFilters = [
  query('search')
    .optional()
    .isString().withMessage('Search query must be a string')
    .trim(),
  
  query('specialization')
    .optional()
    .isString().withMessage('Specialization must be a string'),
  
  query('city')
    .optional()
    .isString().withMessage('City must be a string'),
  
  query('status')
    .optional()
    .isIn(['active', 'filled', 'expired', 'draft', 'all']).withMessage('Invalid status'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
    .toInt(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validateJobCreation, validateJobUpdate, validateSearchFilters };