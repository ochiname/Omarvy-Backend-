import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateCart_Item, NewCart_Item, UpdateCarts, NewCarts } from "./interface";

export class CartModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new Cart/////////////////
    async model_createCart(cart: UpdateCarts): Promise<NewCarts> {
      const [newCart] = await this.db<NewCarts>('carts')
        .insert(cart)
        .returning('*');
      return newCart;
    }  
    
    // read cart data
    async model_getCartByUserId(userId: string): Promise<NewCarts | null> {
      const cart = await this.db<NewCarts>('carts')
        .where({ user_id: userId })
        .first();
      return cart || null;
    }

    ///////////////////read cart data by id//////////////////

    async model_getAllCarts(): Promise<NewCarts[]> {
      return this.db<NewCarts>('carts').select('*');
    }

  ////////////////////////// delete cart ////////////////////////

  async model_deleteCartById(userId: string): Promise<boolean> {
    const rowsAffected = await this.db<NewCarts>('carts')
      .where({ user_id: userId })
      .del();

    return rowsAffected > 0;
  }
 ///////////////////////// calculate cart total ////////////////////////

 async model_calculateCartTotal(cartId: string): Promise<number> {
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