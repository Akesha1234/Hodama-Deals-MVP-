const { body, param, query, validationResult } = require('express-validator');

// ── Check validation result ──
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }
    next();
};

// ═══════════════════════════════════════════
// AUTH VALIDATORS
// ═══════════════════════════════════════════
const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['customer', 'seller']).withMessage('Invalid role'),
    body('sellerProfile.businessName').optional().trim(),
    body('sellerProfile.businessType').optional().trim(),
    body('sellerProfile.category').optional().trim(),
    body('sellerProfile.websiteLink').optional({ checkFalsy: true }).trim().isURL().withMessage('Website link must be a valid URL'),
];

const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

// ═══════════════════════════════════════════
// DEAL VALIDATORS
// ═══════════════════════════════════════════
const createDealRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 120 }).withMessage('Title cannot exceed 120 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required'),
    body('category')
        .notEmpty().withMessage('Category is required'),
    body('originalPrice')
        .notEmpty().withMessage('Original price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('dealPrice')
        .notEmpty().withMessage('Deal price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// ═══════════════════════════════════════════
// ORDER VALIDATORS
// ═══════════════════════════════════════════
const createOrderRules = [
    body('items')
        .isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.deal')
        .notEmpty().withMessage('Deal ID is required for each item'),
    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.name')
        .trim()
        .notEmpty().withMessage('Recipient name is required'),
    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required'),
];

// ═══════════════════════════════════════════
// CATEGORY VALIDATORS
// ═══════════════════════════════════════════
const createCategoryRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required'),
];

// ═══════════════════════════════════════════
// PARAM VALIDATORS
// ═══════════════════════════════════════════
const mongoIdRule = [
    param('id').isMongoId().withMessage('Invalid ID format'),
];

module.exports = {
    validate,
    registerRules,
    loginRules,
    createDealRules,
    createOrderRules,
    createCategoryRules,
    mongoIdRule,
};
