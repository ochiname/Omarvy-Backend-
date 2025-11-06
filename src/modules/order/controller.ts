import { OrderService } from "./service";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../middlewares/jwt_aunthenticator";


export class OrderController {
  private service: OrderService ; 

  constructor() {
    this.service = new OrderService ();
  }

//  async controller_createOrderAfterVerification(
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   try {
//     const userId = req.authUser?.id ? String(req.authUser.id) : null;
//     if (!userId) {
//       res.status(401).json({ message: "Unauthorized: user not logged in" });
//       return;
//     }

//     // ✅ Extract data from request body
//     const { 
//       payment_reference, 
//       delivery_fee_id, 
//       delivery_address, 
//       city 
//     } = req.body;

//     if (!payment_reference || !delivery_fee_id || !delivery_address || !city) {
//       res.status(400).json({ 
//         message: "Missing required fields: payment_reference, delivery_fee_id, delivery_address, or city." 
//       });
//       return;
//     }

//     // ✅ Call the service to create order after verification
//     const result = await this.service.service_createOrderAfterPaymentVerification(
//       userId,
//       payment_reference,
//       delivery_fee_id,
//       delivery_address,
//       city
//     );

//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// }


  async controller_getUserOrdersWithItems(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = String(req.authUser?.id || "");
      if (!userId) {
        res.status(401).json({ message: "Unauthorized: user not logged in" });
        return;
      }

      const result = await this.service.service_getUserOrdersWithItems(userId);

      res.status(200).json({
        message: "Orders retrieved successfully",
        orders: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async controller_getOrderByReference(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
  try {
    const { reference } = req.params; // ✅ payment reference from route param
    if (!reference) {
      res.status(400).json({ message: "Payment reference is required" });
      return;
    }

    const result = await this.service.service_getOrderByReference(reference);

    if (!result) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({
      message: "Order retrieved successfully",
      order: result,
    });
  } catch (error) {
    next(error);
  }
}


  async controller_updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!orderId || !order_status) {
      res.status(400).json({ message: "Order ID and order status are required" });
      return;
    }

    const result = await this.service.service_updateOrderStatus(orderId, order_status);

    res.status(200).json({
      message: "Order status updated successfully",
      order: result,
    });
  } catch (error) {
    next(error);
  }
}


  async controller_deleteOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    const result = await this.service.service_deleteOrder(orderId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

  async controller_getAllOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await this.service.service_getAllOrders();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async controller_getOrderDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      res.status(400).json({ message: "Order ID is required" });
      return;
    }

    const result = await this.service.service_getOrderDetails(orderId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}



} 