export class AppError extends Error { // this class is used to create a new error object
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // if the status code starts with 4 then the status is fail otherwise it is error
        this.isOperational = true; // this property is used to check if the error i know about it or not

        Error.captureStackTrace(this, this.constructor); // this will capture the stack trace
    }
} 