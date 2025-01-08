import { validationResult } from 'express-validator';
import { AppError } from '../utils/ErrorHandling.js';

export const validateRequest = (req, res, next) => { // Without validateRequest, we would have to handle validation errors directly inside each controller function.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new AppError(errorMessages.join('. '), 400));
    }
    next();
};