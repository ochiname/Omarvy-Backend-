import express from 'express';
import authrouter from '../modules/admin auth/index';
import productRouter from '../modules/product/index';
import CartRouter from '../modules/cart';
import deliveryRouter from '../modules/delivery fee/index';
import categoryRouter from '../modules/categories/index';
import paymentRouter from '../modules/payment/index';

const router = express.Router();

// Register routes
router.use('/user', authrouter);
router.use('/product', productRouter);
router.use('/cart', CartRouter);
router.use('/deliveryFee', deliveryRouter);
router.use('/category', categoryRouter);
router.use('payment', paymentRouter);
export default router;
//mypassword123//