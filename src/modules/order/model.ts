import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateOrder_Item, NewOrder_Item, UpdateOrders, NewOrders } from "./interface";

export class OrderModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new Order/////////////////
    async model_createOrder(order: UpdateOrders, trx?: Knex.Transaction): Promise<NewOrders> {
      const query = trx || this.db;
      const [newOrder] = await query<NewOrders>('orders')
        .insert(order)
        .returning('*');
      return newOrder;
    }

    // read order data
    async model_getOrderByUserId(userId: string, trx?: Knex.Transaction): Promise<NewOrders | null> {
      const query = trx || this.db;
      const order = await query<NewOrders>('orders')
        .where({ user_id: userId })
        .first();
      return order || null;
    }

    async model_getOrderByReference(reference: string, trx?: Knex.Transaction): Promise<NewOrders | null> {
      const query = trx || this.db;
      const order = await query<NewOrders>('orders')
        .where({ payment_reference: reference })
        .first();
      return order || null;
    }

    async model_getOrdersId(id: string, trx?: Knex.Transaction): Promise<NewOrders | null> {
      const query = trx || this.db;
      const order = await query<NewOrders>('orders')
          .where({ id })
          .first();
      return order || null;
    }  

    async model_getAllOrders(trx?: Knex.Transaction): Promise<NewOrders[]> {
      const query = trx || this.db;
      return query<NewOrders>('orders')
        .select('*');
    }

  ////////////////////////// delete order ////////////////////////

  async model_deleteOrderById(id: string, trx?: Knex.Transaction): Promise<boolean> {
    const query = trx || this.db;
    const rowsAffected = await query<NewOrders>('orders')
      .where({ id })
      .del();

    return rowsAffected > 0;
  }
    //////////////////// Create a new order Item/////////////////

    async model_createOrderItem(orderItem: UpdateOrder_Item, trx?: Knex.Transaction): Promise<NewOrder_Item> {
      const query = trx || this.db;
      const { price, quantity } = orderItem;

      // Calculate subtotal safely (ensure both values exist and are numeric)
      const subtotal = Number(price) * Number(quantity);

      // Prepare the final record
      const orderItemData = {
        ...orderItem,
        subtotal, // store the computed subtotal
      };
      const [newOrderItem] = await query<NewOrder_Item>('order_items')
        .insert(orderItemData)
        .returning('*');
      return newOrderItem;
    }

    ///////////////////read order item data by id//////////////////

    async model_getOrderItemById(id: string, trx?: Knex.Transaction): Promise<NewOrder_Item | null> {
      const query = trx || this.db;
      const orderItem = await query<NewOrder_Item>('order_items')
        .where({ id })
        .first();
      return orderItem || null;
    }

    async model_getAllOrderItems(trx?: Knex.Transaction): Promise<NewOrder_Item[]> {
      const query = trx || this.db;
      return query<NewOrder_Item>('order_items')
        .select('*');
    }

    async model_getOrderItemsByOrderId(orderId: string, trx?: Knex.Transaction): Promise<NewOrder_Item[]> {
      const query = trx || this.db;
      return query<NewOrder_Item>('order_items')
        .where({ order_id: orderId })
        .select('*');
    }

    async model_getOrderItemsByProductId(productId: string, trx?: Knex.Transaction): Promise<NewOrder_Item[]> {
      const query = trx || this.db;
      return query<NewOrder_Item>('order_items')
        .where({ product_id: productId })
        .select('*');
    }   

    
    ///////////////////////// delete order item ////////////////////////

    async model_deleteOrderItemById(id: string, trx?: Knex.Transaction): Promise<boolean> {
      const query = trx || this.db;
      const rowsAffected = await query<NewOrder_Item>('order_items')
        .where({ id })
        .del();

    return rowsAffected > 0;
  }

  async model_deleteOrderItemsByOrderId(orderId: string, trx?: Knex.Transaction): Promise<boolean> {
    const query = trx || this.db;
    const rowsAffected = await query<NewOrder_Item>('order_items')
      .where({ order_id: orderId })
      .del();

    return rowsAffected > 0;
  }

  /////////////////update order item quantity ///////////////////////

  async model_updateOrderItemQuantity(order_item_id: string, quantity: number, subtotal: number, trx?: Knex.Transaction): Promise<NewOrder_Item | null> {
    const query = trx || this.db;
    const [updatedOrderItem] = await query<NewOrder_Item>('order_items')
      .where({ id: order_item_id })
      .update({ quantity, subtotal })
      .returning('*');
    return updatedOrderItem || null;
  }


  ///////////////// calculate order item subtotal ///////////////////////


}