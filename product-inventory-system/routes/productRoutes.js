import express from 'express';
import { createProduct, deleteProduct, getAllProduct, getProduct, updateProduct } from '../controllers/productControllers.js';
import { protect, restrictTo } from '../controllers/authControllers.js';
const productRouter = express.Router();

// productRouter.get("/", getAllProduct).post(
//     protect,
//     restrictTo('admin'),
//     createProduct
// );
productRouter.route('/').get(getAllProduct).post(protect, restrictTo('admin'), createProduct);


// productRouter
//     .route('/:id')
//     .get(getProduct)
//     .patch(
//         protect,
//         restrictTo('admin'),
//         updateProduct
//     )
//     .delete(
//         protect,
//         restrictTo('admin'),
//         deleteProduct
//     );
productRouter.route('/:id').get(getProduct).put(protect, restrictTo('admin'), updateProduct).delete(protect, restrictTo('admin'), deleteProduct);


export default productRouter;