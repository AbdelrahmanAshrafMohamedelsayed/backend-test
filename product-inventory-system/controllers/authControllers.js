import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from './../models/userModel.js';
import { AppError } from './../util/ErrorHandling.js';
import catchAsync from '../util/catchAsync.js';

const signToken = id => { // this function will create a token for the user
    // console.log('🔥🔥🔥🔥🔥🔥', process.env.JWT_EXPIRES_IN);
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }); // create the token
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = { // create the cookie options to send it to the client
        expires: new Date( // create the expiration date for the cookie
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // convert the days to milliseconds
        ),
        httpOnly: true // the cookie can't be accessed or modified in any way by the browser
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // the cookie will be sent only on an encrypted connection (https)

    res.cookie('jwt', token, cookieOptions); // send the cookie to the client

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
export const signup = catchAsync(async(req, res, next) => {
    console.log("hi")
        // const user = await User.create(req.body); // create a new document in the collection 'User' // it's good but not secure
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
export const protect = catchAsync(async(req, res, next) => {
    // console.log('req.headers', req.body);
    // 1) Getting token and check if it's there
    let token;
    // console.log('req.headers', req.headers);
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]; // get the token from the request header
        // console.log('token', token);
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access.',
                401
            )
        ); // 401 means unauthorized
    }
    // 2) Verification token by using jwt.verify
    // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    // and we need to promisify the jwt.verify because it uses callback and we need to use async await
    // this also will decode the token and verifies that the token was signed with the given secret key.
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // verify the token

    // if we reach this line, it means that the token is valid otherwise an error will be thrown and we will go to the error handling middleware

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id); // get the user from the database
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        ); // 401 means unauthorized
    }
    // GRANT ACCESS TO PROTECTED ROUTE (this is the big trick)
    req.user = currentUser; // we can use this user in the next middleware
    // console.log('req.user 💥 💥 💥 💥 💥 💥 💥', req.user);
    next();
});
export const restrictTo = (...roles) => {
    // we will reach this function after the protect middleware which means that the user is logged in
    // and you will notice that in the protect middleware we set the user in the request object then we can use it here
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // console.log(req.user.role);
            return next(
                new AppError(
                    'You do not have permission to perform this action',
                    403
                )
            ); // 403 means forbidden
        }
        next(); // if the user has the permission, we will go to the next middleware
    };
};