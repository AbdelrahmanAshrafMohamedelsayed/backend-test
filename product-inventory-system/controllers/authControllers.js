import User from './../models/userModel.js';
import { AppError } from './../utils/ErrorHandling.js';
import catchAsync from '../utils/catchAsync.js';
import { createSendToken } from '../utils/tokenUtils.js';



export const signup = catchAsync(async(req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }); // create a new document in the collection 'User'
    createSendToken(user, 201, res);
});

export const login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body; // get the email and password from the request body
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400)); // 400 means bad request
    }
    // 2) Check if user exists && password is correct
    // we need to select the password because it is not selected by default , + means select
    const user = await User.findOne({ email }).select('+password'); // get the user from the database
    // 3) If everything ok, send token to client
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401)); // 401 means unauthorized
    }
    createSendToken(user, 200, res);
});