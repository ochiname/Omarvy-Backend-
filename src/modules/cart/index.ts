import { CartController} from './controller';
import { CartValidator } from './validator';
import express from 'express';
const CartRouter = express.Router();
import { authenticateToken } from '../../middlewares/jwt_aunthenticator';


const controller = new CartController();
// Public routes
CartRouter.post('/addCart', CartValidator.validate(CartValidator.addItemToCartSchema),
controller.controller_addItemToCart.bind(controller));

CartRouter.get('/user/cart', authenticateToken, controller.controller_getCartByUserId.bind(controller));

CartRouter.get('/getAllCarts', authenticateToken, controller.controller_getAllCarts.bind(controller));

CartRouter.put('/updateCartItem/:itemId', CartValidator.validate(CartValidator.updateCartItemSchema), 
controller.controller_updateCartItem.bind(controller)); 

CartRouter.delete('/deleteCart/user', authenticateToken, controller.controller_deleteCartByUserId.bind(controller));


export default CartRouter;