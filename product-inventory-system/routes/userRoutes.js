import express from 'express';
import { login, signup } from '../controllers/authControllers.js';

const userRouter = express.Router();

userRouter.post('/signup', signup); // Will match /api/v1/auth/signup
userRouter.post('/login', login);

// Protect all routes after this middleware to be accessed only by logged in users
// userRouter.use(protect);
// module.exports = userRouter;
export default userRouter;