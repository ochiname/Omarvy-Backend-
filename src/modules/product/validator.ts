import { Request, Response, NextFunction } from "express";
import Joi, { Schema, ValidationError } from "joi";



export class ProductValidator {
 
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

  /** Schema for creating a new product */
  static createProductSchema: Schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.max": `"name" should have a maximum length of {#limit}`,
      "any.required": `"name" is required`,
    }),
    description: Joi.string().min(10).required().messages({
      "string.min": `"description" should have a minimum length of {#limit}`,
      "any.required": `"description" is required`,
    }),
    price: Joi.number().positive().required().messages({
      "number.positive": `"price" must be a positive number`,
      "any.required": `"price" is required`,
    }),
    stock_quantity: Joi.number().integer().min(0).required().messages({
      "number.integer": `"stock" must be an integer`,
      "number.min": `"stock" cannot be negative`,
      "any.required": `"stock" is required`,
    }),
    image_url: Joi.string().uri().optional().messages({
      "string.uri": `"img_url" must be a valid URL`,
    }),
    category_id: Joi.string().required().messages({
      "any.required": `"category_id" is required`,
    }),

  });


  /** Schema for updating product details */
  static updateProductSchema: Schema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.max": `"name" should have a maximum length of {#limit}`,
    }),
    description: Joi.string().min(10).optional().messages({
      "string.min": `"description" should have a minimum length of {#limit}`,
    }),
    price: Joi.number().positive().optional().messages({
      "number.positive": `"price" must be a positive number`,
    }),
    stock_quantity: Joi.number().integer().min(0).optional().messages({
      "number.integer": `"stock_quantity" must be an integer`,
      "number.min": `"stock_quantity" cannot be negative`,
    }),
    image_url: Joi.string().uri().optional().messages({
      "string.uri": `"image_url" must be a valid URL`,
    }),
    category_id: Joi.string().optional().messages({
      "any.required": `"category_id" is required`,
    }),
    })
    .or("name", "description", "price", "stock_quantity", "image_url", "category_id") // At least one field required
      .messages({
      "object.missing": "At least one field must be provided for update",
    });


  /** Schema for deleting a product by ID */
    static deleteProductByIdSchema: Schema = Joi.object({
        id: Joi.number().integer().positive().required(),
    });

    static getProductByIdSchema: Schema = Joi.object({
        id: Joi.number().integer().positive().required(),
    });

    static getProductByNameSchema: Schema = Joi.object({
        name: Joi.string().min(2).max(100).required().messages({
            "string.min": `"name" should have a minimum length of {#limit}`,
            "string.max": `"name" should have a maximum length of {#limit}`,
            "any.required": `"name" is required`,
        }),
    });

};

