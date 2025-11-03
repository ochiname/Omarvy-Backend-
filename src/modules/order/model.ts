import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateCart_Item, NewCart_Item, UpdateOrders, NewOrders } from "./interface";

export class OrderModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new Order/////////////////
    async model_createOrder(order: UpdateOrders): Promise<NewOrders> {
      const [newOrder] = await this.db<NewOrders>('orders')
        .insert(order)
        .returning('*');
      return newOrder;
    }

    // read order data
    async model_getOrderByUserId(userId: string): Promise<NewOrders | null> {
      const order = await this.db<NewOrders>('orders')
        .where({ user_id: userId })
        .first();
      return order || null;
    }
    
    async model_getOrderByReference(reference: string): Promise<NewOrders | null> {
      const order = await this.db<NewOrders>('orders')
        .where({ payment_reference: reference })
        .first();
      return order || null;
    }

    async model_getOrdersId(id: string): Promise<NewOrders | null> {
      const order = await this.db<NewOrders>('orders')
          .where({ id })
          .first();
      return order || null;
    }  

    async model_getAllOrders(): Promise<NewOrders[]> {
      return this.db<NewOrders>('orders')
      .select('*');
    }

  ////////////////////////// delete order ////////////////////////

  async model_deleteOrderById(id: string): Promise<boolean> {
    const rowsAffected = await this.db<NewOrders>('orders')
      .where({ id })
      .del();

    return rowsAffected > 0;
  }
 ///////////////////////// calculate order total ////////////////////////

 async model_calculateOrderTotal(orderId: string): Promise<number> {
  const result = await this.db('cart_items')
    .where({ cart_id: cartId })
    .sum<{ total: string | number }>('subtotal as total')
    .first();

  const total = Number(result?.total) || 0;
  return total;
}
}

export class CartItemModel {
  constructor(public db: Knex = knex) {} // default db instance



    //////////////////// Create a new Cart Item/////////////////

    async model_createCartItem(cartItem: UpdateCart_Item): Promise<NewCart_Item> {
      const { price, quantity } = cartItem;

      // Calculate subtotal safely (ensure both values exist and are numeric)
      const subtotal = Number(price) * Number(quantity);

      // Prepare the final record
      const cartItemData = {
        ...cartItem,
        subtotal, // store the computed subtotal
      };
      const [newCartItem] = await this.db<NewCart_Item>('cart_items')
        .insert(cartItemData)
        .returning('*');
      return newCartItem;
    } 

    ///////////////////read cart item data by id//////////////////

    async model_getCartItemById(id: string): Promise<NewCart_Item | null> {
      const cartItem = await this.db<NewCart_Item>('cart_items')
        .where({ id })
        .first();
      return cartItem || null;
    }   

    async model_getAllCartItems(): Promise<NewCart_Item[]> {
      return this.db<NewCart_Item>('cart_items').select('*');
    } 

    async model_getCartItemsByCartId(cartId: string): Promise<NewCart_Item[]> {
      return this.db<NewCart_Item>('cart_items')
        .where({ cart_id: cartId })
        .select('*');
    }

    ///////////////////////// delete cart item ////////////////////////

    async model_deleteCartItemById(id: string): Promise<boolean> {
      const rowsAffected = await this.db<NewCart_Item>('cart_items')
        .where({ id })  
        .del();

    return rowsAffected > 0;
  }

  async model_deleteCartItemsByCartId(cartId: string): Promise<boolean> {
    const rowsAffected = await this.db<NewCart_Item>('cart_items')
      .where({ cart_id: cartId })  
      .del(); 

    return rowsAffected > 0;
  }

  /////////////////update cart item quantity ///////////////////////

  async model_updateCartItemQuantity(cart_item_id: string, quantity: number, subtotal: number): Promise<NewCart_Item | null> {
    const [updatedCartItem] = await this.db<NewCart_Item>('cart_items')
      .where({ id: cart_item_id })
      .update({ quantity, subtotal })
      .returning('*');
    return updatedCartItem || null;
  } 


  ///////////////// calculate cart item subtotal ///////////////////////


}