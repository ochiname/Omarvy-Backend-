import Joi, { Schema, ValidationError} from "joi";
import { Request, Response, NextFunction } from "express";

export class OrderValidator {
  // Generic validate function
  static validate(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error }: { error?: ValidationError } = schema.validate(req.body, {
        abortEarly: false, // show all errors
        allowUnknown: false, // disallow unknown fields
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return next(new Error(`Validation error: ${messages}`));
      }

      next();
    };
  }

  // ======================= SCHEMAS =======================

  /** 1️⃣ Create Order After Payment Verification */
  static createOrderAfterVerificationSchema = Joi.object({
    payment_reference: Joi.string().required().messages({
      "string.empty": "Payment reference is required.",
      "any.required": "Payment reference is required.",
    }),
    delivery_fee_id: Joi.string().uuid().required().messages({
      "string.empty": "Delivery fee ID is required.",
      "any.required": "Delivery fee ID is required.",
      "string.guid": "Delivery fee ID must be a valid UUID.",
    }),
    delivery_address: Joi.string().min(5).required().messages({
      "string.empty": "Delivery address is required.",
      "any.required": "Delivery address is required.",
    }),
    city: Joi.string().min(2).required().messages({
      "string.empty": "City is required.",
      "any.required": "City is required.",
    }),
  });

  /** 2️⃣ Update Order Status */
  static updateOrderStatusSchema = Joi.object({
    order_status: Joi.string()
      .valid("paid", "pending", "shipped", "delivered", "cancelled", "processing")
      .required()
      .messages({
        "any.only": "Order status must be one of: paid, pending, shipped, delivered, cancelled, processing.",
        "any.required": "Order status is required.",
      }),
  });

  /** 3️⃣ Get Order By Reference */
  static getOrderByReferenceSchema = Joi.object({
    reference: Joi.string().required().messages({
      "string.empty": "Payment reference is required.",
      "any.required": "Payment reference is required.",
    }),
  });

  /** 4️⃣ Delete Order */
  static deleteOrderSchema = Joi.object({
    orderId: Joi.string().uuid().required().messages({
      "string.empty": "Order ID is required.",
      "any.required": "Order ID is required.",
      "string.guid": "Order ID must be a valid UUID.",
    }),
  });

  /** 5️⃣ Get Order Details */
  static getOrderDetailsSchemaWithOrderId = Joi.object({
    orderId: Joi.string().uuid().required().messages({
      "string.empty": "Order ID is required.",
      "any.required": "Order ID is required.",
      "string.guid": "Order ID must be a valid UUID.",
    }),
  });

  static getOrderDetailsSchemaWithUserId = Joi.object({
    UserId: Joi.string().uuid().required().messages({
      "string.empty": "User ID is required.",
      "any.required": "User ID is required.",
      "string.guid": "User ID must be a valid UUID.",
    }),
  });

  /** 6️⃣ Get User Orders (no body validation, just auth) */
  static getUserOrdersSchema = Joi.object({}); // empty, handled by auth middleware
}
