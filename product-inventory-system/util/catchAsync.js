const catchAsync = fn => {
    // this id for async functions that have a catch block and we don't want to repeat the catch block in every async function
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
        // next(err) will pass the error to the error handling middleware
    };
};
export default catchAsync;