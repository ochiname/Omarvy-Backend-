import { CartService } from "./service";
import { Request, Response, NextFunction } from "express";
import { NewCarts, UpdateCarts, NewCart_Item, UpdateCart_Item, AddItemResponse} from "./interface";
import { AuthenticatedRequest } from "../../middlewares/jwt_aunthenticator";


export class CartController {
  private service: CartService; 

  constructor() {
    this.service = new CartService();
  }

  async controller_addItemToCart(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.authUser?.id ? String(req.authUser.id) : null; // ✅ Logged-in user or null
      const sessionId = req.sessionID; // ✅ Comes from express-session middleware

      const cartItem: UpdateCart_Item = req.body;

      const result = await this.service.service_addItemToCart(
        userId,
        sessionId,
        cartItem
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async controller_mergeGuestCart(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = String(req.authUser?.id || "");
      const sessionId = req.sessionID;

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return; // ✅ Important to return
      }

      const result = await this.service.service_mergeGuestCart(sessionId, userId);

      res.status(200).json(result); // ✅ returning Response is fine, TypeScript ignores
    } catch (error) {
      next(error);
    }
  }

  async controller_getCartByUserId(
      req: AuthenticatedRequest,
      res: Response,  
      next: NextFunction
    ): Promise<void> {
      try {
        const userId = String(req.authUser?.id || "");

        if (!userId) {
          res.status(401).json({ message: "User not authenticated" });
          return; // ✅ Important to return
        }

        const result = await this.service.service_getCartByUserId(userId);

        res.status(200).json(result); // ✅ returning Response is fine, TypeScript ignores
      } catch (error) {
        next(error);
      } 
    }

  async controller_getAllCarts(
    req: Request,
    res: Response,  
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.service.service_getAllCarts();
      res.status(200).json(result); 
    } catch (error) {
      next(error);
    }   

  }

  async controller_deleteCartByUserId(
    req: AuthenticatedRequest,
    res: Response,  
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = String(req.authUser?.id || "");  

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return; // ✅ Important to return
      }

      const result = await this.service.service_deleteCartByUserId(userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
    }

  async controller_updateCartItem(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = String(req.authUser?.id || "");
      // const sessionId = req.sessionID;  
      const cartItem: UpdateCart_Item = req.body;
      const cartItemId = req.params.id;

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return; // ✅ Important to return
      } 

      const result = await this.service.service_updateCartItem(
        cartItemId,
        cartItem
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }



} 