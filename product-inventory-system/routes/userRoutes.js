import express from "express";
import { login, signup } from "../controllers/authControllers.js";
import {
    loginValidator,
    signupValidator,
} from "../validators/userValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const userRouter = express.Router();

userRouter.post("/signup", signupValidator, validateRequest, signup);
userRouter.post("/login", loginValidator, validateRequest, login);

export default userRouter;