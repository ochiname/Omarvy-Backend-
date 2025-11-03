import { CartModel, CartItemModel } from './model';
import { AuthModel } from '../admin auth/model';
import { NewCarts, UpdateCarts, NewCart_Item, UpdateCart_Item, AddItemResponse } from './interface';
import { errors } from '../../middlewares/error';
import redisClient from '../../config/redisClient'; 
import dotenv from 'dotenv';
 
dotenv.config();

export class CartService {
  constructor(
    public cartModel: CartModel = new CartModel(),
    public cartItemModel: CartItemModel = new CartItemModel(),
    public authModel: AuthModel = new AuthModel()
  ) {} // default model instance


    
  //////////////////// ✅ service_addItemToCart /////////////////
async service_addItemToCart(
    userId: string | null, // userId is null if guest
    sessionId: string, // from express-session
    cartItem: UpdateCart_Item
  ): Promise<AddItemResponse> {
    const { price, quantity, product_id } = cartItem;

    // ✅ Validate input data
    if (!product_id) {
      console.log('Missing product_id in cartItem');
      throw errors.INVALID_CREDENTIALS;
    }
    if (!price || !quantity || price <= 0 || quantity <= 0) {
      console.log('Invalid price or quantity');
      throw errors.INVALID_CREDENTIALS;
    }

    // ✅ Ensure Redis connection is open
    if (!redisClient.isOpen) await redisClient.connect();

    // ✅ Check if user exists
    const user = userId ? await this.authModel.model_getUserById(userId) : null;
    const isGuest = !user;

    // ✅ Handle guest users — store cart in Redis using sessionId
    if (isGuest) {
      const redisKey = `guest_cart_${sessionId}`;

      // Try to load any existing guest cart
      const existingCart = await redisClient.get(redisKey);
      let cartItems: UpdateCart_Item[] = [];

      try {
        cartItems = existingCart ? JSON.parse(existingCart) : [];
      } catch {
        console.warn(`Corrupted Redis cart for session: ${sessionId}, resetting...`);
        cartItems = [];
      }

      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item: UpdateCart_Item) => item.product_id === cartItem.product_id
      );

      if (existingItemIndex >= 0) {
        // ✅ Update existing item
        cartItems[existingItemIndex].quantity += cartItem.quantity;
        cartItems[existingItemIndex].subtotal =
          cartItems[existingItemIndex].quantity * cartItems[existingItemIndex].price;
      } else {
        // ✅ Add new item
        const subtotal = Number(price) * Number(quantity);
        cartItems.push({ ...cartItem, subtotal });
      }

      // ✅ Save back to Redis (expire in 7 days)
      await redisClient.set(redisKey, JSON.stringify(cartItems), {
        EX: 60 * 60 * 24 * 7, // 7 days expiration
      });

      return { message: 'Item added to guest cart (Redis).' };
    }

    // ✅ Handle logged-in users (persistent DB cart)
    let cart = await this.cartModel.model_getCartByUserId(userId!);

    if (!cart) {
      cart = await this.cartModel.model_createCart({
        user_id: userId!,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // ✅ Add item to cart_items table (subtotal handled in model)
    const newCartItem = await this.cartItemModel.model_createCartItem({
      ...cartItem,
      cart_id: cart.id,
    });

    // ✅ Update total for this cart
    const total = await this.cartModel.model_calculateCartTotal(cart.id);

    return {
      message: 'Item added to cart successfully.',
      cart_id: cart.id,
      item: newCartItem,
      total,
    };
  }


//  async service_addItemToCart(
//   userId: string,
//   cartItem: UpdateCart_Item
// ): Promise<{ 
//   message: string; 
//   cart_id?: string; 
//   item?: NewCart_Item; 
//   total?: number; 
// }> {
//   const { price, quantity } = cartItem;

//   // ✅ Validate input
//   if (!price || !quantity || price <= 0 || quantity <= 0) {
//     console.log("Invalid price or quantity");
//     throw errors.INVALID_CREDENTIALS;
//   }

//   // ✅ Check if user exists
//   const user = await this.authModel.model_getUserById(userId);
//   const isGuest = !user;

//   // ✅ Handle guest users (save to Redis)
//   if (isGuest) {
//     await redisClient.set(`guest_cart_${userId}`, JSON.stringify(cartItem));
//     return { message: 'Item added to guest cart (Redis).' };
//   }

//   // ✅ Fetch or create user cart
//   let cart = await this.cartModel.model_getCartByUserId(userId);
//   if (!cart) {
//     cart = await this.cartModel.model_createCart({
//       user_id: userId,
//       created_at: new Date(),
//       updated_at: new Date(),
//     });
//   }

//   // ✅ Create new cart item
//   const newCartItem = await this.cartItemModel.model_createCartItem({
//     ...cartItem,
//     cart_id: cart.id,
//   });

//   // ✅ Recalculate total from DB (model handles summing)
//   const total = await this.cartModel.model_calculateCartTotal(cart.id);

//   // ✅ Return structured response
//   return {
//     message: 'Item added to cart successfully.',
//     cart_id: cart.id,
//     item: newCartItem,
//     total,
//   };
// }
  
  //////////////////// ✅ service_mergeGuestCart /////////////////

async service_mergeGuestCart(
  sessionId: string,
  userId: string
): Promise<{ message: string; total: number }> {
  // 1️⃣ Confirm user exists
  const user = await this.authModel.model_getUserById(userId);
  if (!user) throw errors.UNAUTHORIZED;

  // 2️⃣ Ensure Redis connection
  if (!redisClient.isOpen) await redisClient.connect();

  const redisKey = `guest_cart_${sessionId}`;

  // 3️⃣ Retrieve guest cart from Redis
  const redisData = await redisClient.get(redisKey);
  if (!redisData) return { message: "No guest cart found to merge.", total: 0 };

  let guestItems: UpdateCart_Item[];
  try {
    guestItems = JSON.parse(redisData);
  } catch {
    console.warn(`Corrupted guest cart for session: ${sessionId}`);
    await redisClient.del(redisKey);
    return { message: "Corrupted guest cart removed.", total: 0 };
  }

  // 4️⃣ Get or create user's DB cart
  let cart = await this.cartModel.model_getCartByUserId(userId);
  if (!cart) {
    cart = await this.cartModel.model_createCart({
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  // 5️⃣ Merge each guest item into DB cart
  for (const item of guestItems) {
    const existingItems = await this.cartItemModel.model_getCartItemsByCartId(
      cart.id,
    );

    const existingItem = existingItems.find(i => i.product_id === item.product_id);

    if (existingItem) {
      // ✅ Item already exists → update quantity + subtotal
      const updatedQuantity = existingItem.quantity + item.quantity;
      const updatedSubtotal = updatedQuantity * existingItem.price;

      await this.cartItemModel.model_updateCartItemQuantity(
        existingItem.id,
        updatedQuantity,
        updatedSubtotal
      );
    } else {
      // ✅ Add as a new item
      await this.cartItemModel.model_createCartItem({
        ...item,
        cart_id: cart.id,
      });
    }
  }

  // 6️⃣ Recalculate total
  const total = await this.cartModel.model_calculateCartTotal(cart.id);

  // 7️⃣ Clear guest cart from Redis
  await redisClient.del(redisKey);

  return {
    message: "Guest cart merged successfully.",
    total,
  };
}


  //////////////////// ✅ service_getCartByUserId /////////////////

async service_getCartByUserId(userId: string): Promise<{
  cart: NewCarts;
  items: NewCart_Item[];
  total: number;
}> {
  // 1️⃣ Validate input
  if (!userId) {
    console.log("User ID is required in service_getCartByUserId");
    throw errors.UNAUTHORIZED;
  }

  // 2️⃣ Fetch cart
  const cart = await this.cartModel.model_getCartByUserId(userId);
  if (!cart) {
    console.log(`No cart found for user ID: ${userId}`);
    throw errors.NOT_FOUND;
  }

  // 3️⃣ Fetch cart items (each item already includes subtotal)
  const items = await this.cartItemModel.model_getCartItemsByCartId(cart.id);

  // 4️⃣ Calculate total (sum of item subtotals)
  const total = await this.cartModel.model_calculateCartTotal(cart.id);

  // 5️⃣ Return full cart summary
  return {
    cart,
    items,
    total,
  };
}

  //////////////////// ✅ service_getAllCarts /////////////////

async service_getAllCarts(): Promise<NewCarts[]> {
    return await this.cartModel.model_getAllCarts();
  }

  //////////////////// ✅ service_deleteCartByUserId /////////////////

  async service_deleteCartByUserId(userId: string): Promise<boolean> {
    if (!userId) {
      console.log("User ID is required — validation failed in service_deleteCartByUserId()");
      throw errors.UNAUTHORIZED;
    }   
    return await this.cartModel.model_deleteCartById(userId);   
}

  //////////////////// ✅ service_updateCartItem /////////////////  
async service_updateCartItem(
  cartItemId: string,
  data: Partial<UpdateCart_Item>
): Promise<NewCart_Item | null> {
  if (!cartItemId) {
    console.log("Cart Item ID is required — validation failed in service_updateCartItem()");
    throw errors.UNAUTHORIZED;
  }

  if (data.quantity === undefined) {
    throw new Error("Quantity is required to update cart item");
  }

  if (data.subtotal === undefined) {
    throw new Error("Subtotal is required to update cart item");
  }

  return await this.cartItemModel.model_updateCartItemQuantity(
    cartItemId,
    data.quantity,
    data.subtotal
  );
}

}