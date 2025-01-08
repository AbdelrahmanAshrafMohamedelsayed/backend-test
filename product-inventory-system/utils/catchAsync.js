const catchAsync = fn => { // fn is the function that we want to run
    return (req, res, next) => { // this will wrap the function in a new function to catch any errors
        fn(req, res, next).catch(err => next(err));
        // next(err) will pass the error to the error handling middleware
    };
};
export default catchAsync;