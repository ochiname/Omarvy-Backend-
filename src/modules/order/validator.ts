import { Request, Response, NextFunction } from "express";
import Joi, { Schema, ValidationError } from "joi";



export class CartValidator {
 
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
 
  /** Schema for registering a new cart*/
    static addItemToCartSchema = Joi.object({
      product_id: Joi.string().uuid().required().messages({
      'string.empty': 'Product ID is required.',
      'any.required': 'Product ID is required.',
      'string.guid': 'Product ID must be a valid UUID.',
    }),
    price: Joi.number().positive().required().messages({
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be greater than 0.',
      'any.required': 'Price is required.',
    }),
    quantity: Joi.number().integer().positive().required().messages({
      'number.base': 'Quantity must be a number.',
      'number.integer': 'Quantity must be an integer.',
      'number.positive': 'Quantity must be greater than 0.',
      'any.required': 'Quantity is required.',
    }),
    subtotal: Joi.number().positive().optional(),
  });
  

    static addItemToCartConditionalSchema = Joi.object({
    userId: Joi.string().uuid().allow(null),
    sessionId: Joi.string().when('userId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    cartItem: CartValidator.addItemToCartSchema.required(),
  });

    /** ✅ 3. Update cart item */
  static updateCartItemSchema = Joi.object({
    price: Joi.number().positive().optional(),
    quantity: Joi.number().integer().positive().optional(),
    subtotal: Joi.number().positive().optional(),
  }).min(1); // At least one field must be updated

  /** ✅ 4. Delete cart by user ID (no body needed — only auth, so optional schema) */
  static deleteCartByUserSchema = Joi.object({}); // empty for now

  /** ✅ 5. Get cart by user ID (no body, just user auth) */
  static getCartByUserSchema = Joi.object({}); // empty

  /** ✅ 6. Merge guest cart */
  static mergeGuestCartSchema = Joi.object({
    sessionId: Joi.string().required().messages({
      "any.required": "Session ID is required to merge cart.",
    }),
  });

}