import { OrderModel, } from './model';
import { errors } from '../../middlewares/error';
import dotenv from 'dotenv';
import { CartModel } from '../cart/model';
import { CartItemModel } from '../cart/model';
import { DeliveryFeeModel } from '../delivery fee/model';
import { CartService } from '../cart/service';
import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
 
dotenv.config();

export class OrderService {
  constructor(
    private cartModel = new CartModel(),
    private cartItemModel = new CartItemModel(),
    private db: Knex = knex,
    private orderModel = new OrderModel(),
    private deliveryFeeModel = new DeliveryFeeModel(),
    private cartService = new CartService()
  ) {}

  //////////////////// ✅ service_createOrderAfterPaymentVerification /////////////////
    async service_createOrderAfterPaymentVerification(
      userId: string,
      paymentReference: string,
      deliveryFeeId: string,
      deliveryAddress: string,
      city: string
    ) {
      return this.db.transaction(async (trx) => {
        // ✅ Step 1: Get user's cart and items
        const cart = await this.cartModel.model_getCartByUserId(userId, trx);
        if (!cart) throw new Error("Cart not found for user.");

        const cartItems = await this.cartItemModel.model_getCartItemsByCartId(cart.id, trx);
        if (!cartItems.length) throw new Error("No items found in cart.");

        // ✅ Step 2: Calculate total (cart + delivery fee)
        const finalTotal = await this.cartService.service_calculateFinalTotal(cart.id, deliveryFeeId);

        // ✅ Step 3: Get delivery fee details
        const deliveryFee = await this.deliveryFeeModel.model_getDeliveryFeeById(deliveryFeeId);
        if (!deliveryFee) throw new Error("Invalid delivery fee selected.");

        // ✅ Step 4: Create new order record
        const orderData = {
          user_id: userId,
          payment_reference: paymentReference,
          total_amount: finalTotal,
          payment_status: "paid",
          order_status: "processing",
          delivery_fee_id: deliveryFeeId,
          delivery_fee: deliveryFee.fee,
          city,
          delivery_address: deliveryAddress,
          created_at: new Date(),
          updated_at: new Date(),
        } as const;

        const order = await this.orderModel.model_createOrder(orderData, trx);

        // ✅ Step 5: Create order_items
        for (const item of cartItems) {
          const subtotal = Number(item.price) * Number(item.quantity);

          await this.orderModel.model_createOrderItem(
            {
              order_id: order.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              subtotal,
            },
            trx
          );
        }

        // ✅ Step 6: Clear user's cart
        await this.cartItemModel.model_clearCart(cart.id, trx);

        // ✅ Step 7: Return response
        return {
          message: "Order successfully created after payment verification.",
          order_id: order.id,
          total_amount: finalTotal,
          delivery_fee: deliveryFee.fee,
          city,
          delivery_address: deliveryAddress,
        };
      });
    }

    async service_getUserOrdersWithItems(userId: string) {
      if (!userId)
        throw errors.NOT_FOUND
      const order = await this.orderModel.model_getOrderByUserId(userId);
      if (!order) 
        throw errors.NOT_FOUND;
      const orderItems = await this.orderModel.model_getOrderItemsByOrderId(order.id);
      return { order, orderItems };
    }

    async service_getOrderByReference(reference: string) {
      const order = await this.orderModel.model_getOrderByReference(reference);
      if (!order) throw new Error("Order not found for this payment reference.");
      return order;
    }

    async service_updateOrderStatus(orderId: string, status: string) {
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) throw new Error("Invalid order status.");

      const updated = await this.db("orders")
        .where({ id: orderId })
        .update({ order_status: status, updated_at: new Date() })
        .returning("*");

      if (!updated.length) throw new Error("Order not found or update failed.");
      return updated[0];
    }

    async service_deleteOrder(orderId: string) {
      return this.db.transaction(async (trx) => {
        await this.orderModel.model_deleteOrderItemsByOrderId(orderId, trx);
        const deleted = await this.orderModel.model_deleteOrderById(orderId, trx);

        if (!deleted) 
          throw errors.BAD_REQUEST;
            console.log("order deletion failed")
        return { message: "Order deleted successfully" };
      }

    )};

    async service_getAllOrders() {
      const orders = await this.orderModel.model_getAllOrders();
      return orders;
    }

    async service_getOrderDetails(orderId: string) {
      const order = await this.orderModel.model_getOrdersId(orderId);
      if (!order) throw errors.NOT_FOUND;

      const items = await this.orderModel.model_getOrderItemsByOrderId(orderId);
      return { order, items };
    }
}


  



  
  