import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    console.error(err);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server is running on port 3000');
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});