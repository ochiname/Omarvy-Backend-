import express from 'express';
import { OrderController } from './controller';
import { OrderValidator } from './validator';
import { authenticateToken, requireRole } from '../../middlewares/jwt_aunthenticator';

const OrderRouter = express.Router();
const controller = new OrderController();

// Apply authentication middleware to all routes
OrderRouter.use(authenticateToken);

// ======================= CART ROUTES =======================

// create order 
// OrderRouter.post('/create/orders',OrderValidator.validate(OrderValidator.createOrderAfterVerificationSchema),
//   controller.controller_createOrderAfterVerification.bind(controller)
// );

// Get order with  userid
OrderRouter.get('/get-orders-order_items/:userId',OrderValidator.validate(OrderValidator.getOrderDetailsSchemaWithUserId),
  controller.controller_getUserOrdersWithItems.bind(controller)
);

// Get with refrence
OrderRouter.get('/get/orders/:reference', OrderValidator.validate(OrderValidator.getOrderByReferenceSchema),
  controller.controller_getOrderByReference.bind(controller)
);
// Get all orders
OrderRouter.get('/get-all-orders', requireRole("admin"), controller.controller_getAllOrders.bind(controller)
);

OrderRouter.get('/get-orders/:orderId',  requireRole("admin"), OrderValidator.validate(OrderValidator.getOrderDetailsSchemaWithOrderId), 
  controller.controller_getAllOrders.bind(controller)
);

// Update order status
OrderRouter.put('/updateorder-status/:itemId', OrderValidator.validate(OrderValidator.updateOrderStatusSchema),
  controller.controller_updateOrderStatus.bind(controller)
);

// Delete user's cart
OrderRouter.delete('/deleteOder',  requireRole("admin"), OrderValidator.validate(OrderValidator.deleteOrderSchema),
  controller.controller_deleteOrder.bind(controller)
);

// ======================= ORDER ROUTES =======================

// // Create order after payment verification
// OrderRouter.post(
//   '/create-order-after-verification',
//   OrderValidator.validate(OrderValidator.createOrderAfterVerificationSchema),
//   controller.controller_createOrderAfterVerification.bind(controller)
// );

// // Get user's orders with items
// OrderRouter.get(
//   '/my-orders',
//   controller.controller_getUserOrdersWithItems.bind(controller)
// );

// // Get order by payment reference
// OrderRouter.get(
//   '/order/:reference',
//   OrderValidator.validate(OrderValidator.getOrderByReferenceSchema),
//   controller.controller_getOrderByReference.bind(controller)
// );

// // Update order status
// OrderRouter.patch(
//   '/update-order-status/:orderId',
//   OrderValidator.validate(OrderValidator.updateOrderStatusSchema),
//   controller.controller_updateOrderStatus.bind(controller)
// );

// // Delete order
// OrderRouter.delete(
//   '/order/:orderId',
//   OrderValidator.validate(OrderValidator.deleteOrderSchema),
//   controller.controller_deleteOrder.bind(controller)
// );

// // Get order details
// OrderRouter.get(
//   '/order-details/:orderId',
//   OrderValidator.validate(OrderValidator.getOrderDetailsSchema),
//   controller.controller_getOrderDetails.bind(controller)
// );

// export default OrderRouter;


export default OrderRouter;