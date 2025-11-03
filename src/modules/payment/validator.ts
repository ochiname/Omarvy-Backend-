// src/modules/payment/validator.ts
import Joi, { Schema, ValidationError } from "joi";
import { Request, Response, NextFunction } from "express";


export class PaymentValidator {
    static validate(schema: Schema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error }: { error?: ValidationError } = schema.validate(req.body, {
        abortEarly: false, // Show all errors
        allowUnknown: false, // Disallow fields not in schema
      });

      if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return next(new Error(`Validation error: ${messages}`));
      }

      next();
    };
  }
  static initializePaymentSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    amount: Joi.number().positive().required(),
    provider: Joi.string()
      .valid("paystack", "flutterwave", "stripe", "paypal")
      .required(),
  });

  static verifyPaymentSchema = Joi.object({
    userId: Joi.string().uuid().required(),
    payment_reference: Joi.string().required(),
    provider: Joi.string()
      .valid("paystack", "flutterwave", "stripe", "paypal")
      .required(),
  });

}

