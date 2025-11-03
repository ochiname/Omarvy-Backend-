import { Request, Response, NextFunction } from "express";
import Joi, { Schema, ValidationError } from "joi";



export class AuthValidator {
 
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

  // 🧩 ======================= SCHEMAS =======================

  /** Schema for registering a new delivery fee */
  static createDeliveryFeeSchema: Schema = Joi.object({
    location: Joi.string().required().messages({
      "any.required": `"location" is required`,
    }),
    fee: Joi.number().positive().required().messages({
      "number.positive": `"fee" must be a positive number`,
      "any.required": `"fee" is required`,
    }),
  });

  
  /** Schema for fetching delivery fee by location */
  static getDeliveryFeeByLocationSchema: Schema = Joi.object({
    location: Joi.string().required().messages({
      "any.required": `"location" is required`,
    }),
  });

  static getDeliveryFeeByIdSchema: Schema = Joi.object({
    id: Joi.string().required().messages({
      "any.required": `"id" is required`,
    }),
  });
   
  /** Schema for updating delivery fee details */
  static updateDeliveryFeeByIdSchema: Schema = Joi.object({
    id: Joi.string().required().messages({
      "any.required": `"id" is required`,
    }),
    location: Joi.string().optional(),
    fee: Joi.number().positive().optional().messages({
      "number.positive": `"fee" must be a positive number`,
    }),   
    });

  static updateDeliveryFeeByLocationSchema: Schema = Joi.object({
    location: Joi.string().required().messages({
      "any.required": `"location" is required`, 
    }),
    fee: Joi.number().positive().optional().messages({
      "number.positive": `"fee" must be a positive number`,
    }),   
    });

  /** Schema for deleting a user by email */
    static deleteDeliveryFeeByLocationSchema: Schema = Joi.object({
        location: Joi.string().required(),
    });

    static deleteDeliveryFeeByIdSchema: Schema = Joi.object({
        id: Joi.string().required(),
    });

}