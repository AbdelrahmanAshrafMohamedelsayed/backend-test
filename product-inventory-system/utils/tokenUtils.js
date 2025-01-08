import jwt from 'jsonwebtoken';

export const signToken = id => { 
    return jwt.sign({ id: id }, process.env.JWT_SECRET, { //this will create a token with the user id and the secret key
        expiresIn: process.env.JWT_EXPIRES_IN //this will set the expiration time for the token
    });
};

export const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id); //this will create a token for the user
    const cookieOptions = { //this will set the cookie options
        expires: new Date( //this will set the expiration time for the cookie
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true //this will make sure that the cookie cannot be accessed or modified by the browser This mitigates cross-site scripting (XSS) attacks.
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; //this will make sure that the cookie is only sent on a secure connection

    res.cookie('jwt', token, cookieOptions); //this will set the cookie with the token

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