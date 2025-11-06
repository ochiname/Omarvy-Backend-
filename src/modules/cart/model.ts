import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateCart_Item, NewCart_Item, UpdateCarts, NewCarts } from "./interface";

export class CartModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new Cart/////////////////
    async model_createCart(cart: UpdateCarts, trx?: Knex.Transaction): Promise<NewCarts> {
        const query = trx || this.db;

      const [newCart] = await query<NewCarts>('carts')
        .insert(cart)
        .returning('*');
      return newCart;
    }  
    
    // read cart data
    async model_getCartByUserId(userId: string, trx?: Knex.Transaction): Promise<NewCarts | null> {
      const query = trx || this.db;
      const cart = await query<NewCarts>('carts')
        .where({ user_id: userId })
        .first();
      return cart || null;
    }

    ///////////////////read cart data by id//////////////////

    async model_getAllCarts(trx?: Knex.Transaction): Promise<NewCarts[]> {
      const query = trx || this.db;
      return query<NewCarts>('carts').select('*');
    }

  ////////////////////////// delete cart ////////////////////////

    async model_deleteCartById(userId: string, trx?: Knex.Transaction): Promise<boolean> {
      const query = trx || this.db;
      const rowsAffected = await query<NewCarts>('carts')
        .where({ user_id: userId })
        .del();

      return rowsAffected > 0;
    }
  ///////////////////////// calculate cart total ////////////////////////

    async model_calculateCartTotal(cartId: string, trx?: Knex.Transaction): Promise<number> {
      const query = trx || this.db;
      const result = await query('cart_items')
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

    async model_createCartItem(cartItem: UpdateCart_Item, trx?: Knex.Transaction): Promise<NewCart_Item> {
      const query = trx || this.db; 
      const { price, quantity } = cartItem;

      // Calculate subtotal safely (ensure both values exist and are numeric)
      const subtotal = Number(price) * Number(quantity);

      // Prepare the final record
      const cartItemData = {
        ...cartItem,
        subtotal, // store the computed subtotal
      };
      const [newCartItem] = await query<NewCart_Item>('cart_items')
        .insert(cartItemData)
        .returning('*');
      return newCartItem;
    } 

    ///////////////////read cart item data by id//////////////////

    async model_getCartItemById(id: string, trx?: Knex.Transaction): Promise<NewCart_Item | null> {
      const query = trx || this.db;
      const cartItem = await query<NewCart_Item>('cart_items')
        .where({ id })
        .first();
      return cartItem || null;
    }   

    async model_getAllCartItems(trx?: Knex.Transaction): Promise<NewCart_Item[]> {
      const query = trx || this.db;
      return query<NewCart_Item>('cart_items').select('*');
    } 

    async model_getCartItemsByCartId(cartId: string, trx?: Knex.Transaction): Promise<NewCart_Item[]> {
      const query = trx || this.db;
      return query<NewCart_Item>('cart_items')
        .where({ cart_id: cartId })
        .select('*');
    }

    ///////////////////////// delete cart item ////////////////////////

    async model_deleteCartItemById(id: string, trx?: Knex.Transaction): Promise<boolean> {
      const query = trx || this.db;
      const rowsAffected = await query<NewCart_Item>('cart_items')
        .where({ id })
        .del();

    return rowsAffected > 0;
  }

    async model_deleteCartItemsByCartId(cartId: string, trx?: Knex.Transaction): Promise<boolean> {
      const query = trx || this.db;
      const rowsAffected = await query<NewCart_Item>('cart_items')
        .where({ cart_id: cartId })
        .del();

      return rowsAffected > 0;
    }

    async model_clearCart(cartId: string, trx?: Knex.Transaction): Promise<void> {
      const query = trx || this.db; 
      await query('cart_items')
        .where({ cart_id: cartId })
        .del();
    }

  /////////////////update cart item quantity ///////////////////////

  async model_updateCartItemQuantity(cart_item_id: string, quantity: number, subtotal: number, trx?: Knex.Transaction): Promise<NewCart_Item | null> {
    const query = trx || this.db;
    const [updatedCartItem] = await query<NewCart_Item>('cart_items')
      .where({ id: cart_item_id })
      .update({ quantity, subtotal })
      .returning('*');
    return updatedCartItem || null;
  } 


  ///////////////// calculate cart item subtotal ///////////////////////


}