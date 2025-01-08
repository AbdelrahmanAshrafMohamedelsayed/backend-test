import mongoose from "mongoose";
import validator from "validator";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: [5, "A product must have more or equal than 5 characters"], // min length of the string
        required: [true, "A product must have a name"],
    },
    category: {
        type: String,
        trim: true,
        enum: [
            "Electronics",
            "Clothing",
            "Books",
            "Home & Garden",
            "Sports",
            "Toys",
            "Food",
            "Beauty",
            "Automotive",
            "General",
        ], // Limit categories
        default: "General",
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"],
        min: [0, "Price cannot be negative"],
        max: [1000000, "Price cannot exceed 1,000,000"],
    },
    quantity: {
        type: Number,
        required: [true, "A product must have a quantity"],
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0;
            },
            message: "Quantity must be a non-negative integer",
        },
    },
}, { timestamps: true });
// Add indexes
productSchema.index({ name: 1 }); // Searches by product name
productSchema.index({ category: 1 }); // Filtering by category
productSchema.index({ price: 1 }); // Price-based queries and sorting
const product = mongoose.model("product", productSchema); // create in the database a collection named 'product' with the schema 'productSchema'
export default product;