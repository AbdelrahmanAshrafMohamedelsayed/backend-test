import { AppError } from "../utils/ErrorHandling.js";
import validator from "validator";
const handleInvalidIdErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`; // err.path is the field that has the invalid value and err.value is the invalid value
    return new AppError(message, 400); // 400 is for bad request
};
const handleDuplicateKeyErrorDB = (err) => {
    // alway the value is in err.keyValue and itis the first value in the object
    const values = Object.values(err.keyValue); // err.keyValue is an object that has the duplicate value
    const value = values[0];
    // check if the value is an email
    if (validator.isEmail(value)) {
        const message = `This email is already taken. Please choose a different one.`;
        return new AppError(message, 400);
    }
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errorsObj = err.errors;
    //Object.keys Make array of keys
    const errorMessagesArray = Object.keys(errorsObj).map((key) => {
        return errorsObj[key].message;
    });
    const message = `Invalid input data. ${errorMessagesArray.join(". ")}`;
    return new AppError(message, 400);
};
const handleJWTError = () => {
    return new AppError("Invalid token. Please log in again!", 401);
};
const handleExpireError = () => {
    return new AppError("Your token has expired! Please log in again.", 401);
}; 
const sendErrorDev = (err, res) => { // Development Error Handling
    res.status(err.statusCode).json({ // send the error to the client
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack, // stack trace
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    // if operational (i.e., expected, like validation errors), it sends the error's message.
    // if it's a programming or other unknown error, it sends a generic message.
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error("ERROR 💥", err);
        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
};
const ErrorHandlingFunc = (err, req, res, next) => {
    // Error Handling Middleware function
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = {...err }; // this will create a new object with all the properties of err
        error.message = err.message;

        if (error.kind === "ObjectId") {
            error = handleInvalidIdErrorDB(error);
        }
        console.log("error.code", error.code);
        if (error.code === 11000) {
            error = handleDuplicateKeyErrorDB(error);
        }

        if (error.errors) {
            error = handleValidationErrorDB(error);
        }
        if (error.name === "JsonWebTokenError") {
            error = handleJWTError();
        }
        if (error.name === "TokenExpiredError") {
            error = handleExpireError();
        }
        sendErrorProd(error, res);
    }
};
export default ErrorHandlingFunc;