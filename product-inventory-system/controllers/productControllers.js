import product from "../models/productModel.js";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from "./handlerFactory.js";

export const getAllProduct = getAll(product);
export const createProduct = createOne(product);
export const getProduct = getOne(product);
export const updateProduct = updateOne(product);
export const deleteProduct = deleteOne(product);