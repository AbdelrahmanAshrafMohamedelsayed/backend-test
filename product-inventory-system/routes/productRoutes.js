import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    getProduct,
    updateProduct,
} from "../controllers/productControllers.js";
import { protect } from "../middleware/authenticationMiddleware.js";
import { restrictTo } from "../middleware/authorizationMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
    createProductValidation,
    updateProductValidation,
} from "../validators/productValidator.js";
const productRouter = express.Router();

productRouter
    .route("/")
    .get(getAllProduct)
    .post(
        protect,
        restrictTo("admin"),
        createProductValidation,
        validateRequest,
        createProduct
    );

productRouter
    .route("/:id")
    .get(getProduct)
    .put(
        protect,
        restrictTo("admin"),
        updateProductValidation,
        validateRequest,
        updateProduct
    )
    .delete(protect, restrictTo("admin"), deleteProduct);

export default productRouter;