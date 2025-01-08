import { body } from 'express-validator';

export const createProductValidation = [
    body('name')
    .trim()
    .isLength({ min: 5 })
    .withMessage('A product must have more or equal than 5 characters')
    .notEmpty()
    .withMessage('A product must have a name'),

    body('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Beauty', 'Automotive', 'General'])
    .withMessage('Invalid category selected'),

    body('price')
    .notEmpty()
    .withMessage('A product must have a price')
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Price must be between 0 and 1,000,000'),

    body('quantity')
    .notEmpty()
    .withMessage('A product must have a quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
];

export const updateProductValidation = [
    body('name')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('A product must have more or equal than 5 characters'),

    body('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Beauty', 'Automotive', 'General'])
    .withMessage('Invalid category selected'),

    body('price')
    .optional()
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Price must be between 0 and 1,000,000'),

    body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
];