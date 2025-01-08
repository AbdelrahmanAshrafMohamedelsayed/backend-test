import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import morgan from "morgan";
import express from "express";
import helmet from "helmet";
import { AppError } from "./utils/ErrorHandling.js";
import compression from "compression";
import cors from "cors";
import ErrorHandlingFunc from "./controllers/errorControllers.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
const app = express();

app.use(cors()); // enable all cors requests (simple requests) 
app.options("*", cors()); // enable all preflight requests is needed for complex requests.
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
// 1) should be the first middleware to include the security headers
// helmet: Adds various security headers to protect the app.
// security headers: 1) Content-Security-Policy 2) X-Content-Type-Options 3) X-Frame-Options 4) X-XSS-Protection 5) Strict-Transport-Security
//xss = Cross-Site Scripting
// these headers are used to protect the app from various attacks like XSS, clickjacking, etc...
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
    // morgan: HTTP request logger middleware for node.js . Logs detailed request information (method, status, response time, etc.) in development mode.
    app.use(morgan("dev"));
} else {
    // console.log('production');
}
const limiter = rateLimit({ // limit the number of requests from the same IP (prevent DOS attacks)
    max: 1000, // 1000 requests per hour
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many requests from this IP, please try again in an hour!", // error message
});
app.use("/", limiter); // apply the limiter middleware to all routes starting with /

// Body parser, reading data from body into req.body (limit the size of the body to 10kb) (prevent DOS attacks) (prevent sending huge payload to the server)
app.use(express.json({ limit: "10kb" })); // here we read the data from the body and parse it to json and put it in req.body
//  we need to clean the data in the body from any malicious code (prevent NoSQL injection)
// then we need to clean the data from any malicious html code (prevent XSS attacks)
//  we need data sanitization against parameter pollution (prevent duplicate query strings)
// Data sanitization against NoSQL query injection
/**
 * how nosql injection works:
 * he can login with the following credentials:
 * {email: {"$gt": ""}} (this will return all the users in the database) becuase this always return true
 * any password exists in the database
 * you will find the user has logged in successfully with the email and password
 */
app.use(mongoSanitize());
// what mongoSanitize does is that it will look at the req.body, req.queryString, req.params and filter out all the $ and the . from the data

// Data sanitization against XSS
/*
 * how XSS works: when the user sends a malicious html code in the body of the request
 * and the server will send back the malicious html code to the client and the client will execute the malicious code
 */
// Removes malicious HTML/JavaScript from inputs.
app.use(xss());
//  what xss does is that it will look at the req.body, req.queryString, req.params and filter out all the html code
// for example if the user sends the following in the body of the request:
// <script>alert('hello world')</script>
// the server will send back the following to the client:
// &lt;script&gt;alert('hello world')&lt;/script&gt;
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public"))); // serve static files from the public folder

app.use(compression()); // compress all the text that is sent to the client (html, css, js, json, etc...) 
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); // add a property to the request object
    next();
});
// 3) ROUTES
app.use("/auth", userRouter);
app.use("/products", productRouter);

// 4) Handling Unhandled Routes
// Handles requests to undefined routes.
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // pass the error to the next middleware
});
// 5) Error Handling Middleware
// Centralized error handler for catching and responding to errors.
app.use(ErrorHandlingFunc);
export default app;