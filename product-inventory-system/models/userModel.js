import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: [true, 'This email is already taken'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },

    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        validate: {
            validator: function(value) {
                return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value);
            },
            message: 'Password must contain at least one letter, one number, and one special character.'
        },
        select: false // never show the password in any output
    },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    //  this refers to the current document being processed
    // Only run this function if password was actually modified.why? because this function will run every time we save a document and we don't want to hash the password every time we save a document
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12); // we don't need to save it in the database as it is already will be saved in the database

    // Delete passwordConfirm field // we don't need to save it in the database
    //  undefined is used to delete a field from the document in database
    this.passwordConfirm = undefined;
    next();
});
userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema); // create in the database a collection named 'User' with the schema 'userSchema'
export default User;