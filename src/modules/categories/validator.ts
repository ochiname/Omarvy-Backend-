import { Request, Response, NextFunction } from "express";
import Joi, { Schema, ValidationError } from "joi";



export class CategoryValidator {
 
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

  /** Schema for creating a new category */
  static createCategorySchema: Schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.max": `"name" should have a maximum length of {#limit}`,
      "any.required": `"name" is required`,
    }),
    description: Joi.string().min(10).required().messages({
      "string.min": `"description" should have a minimum length of {#limit}`,
      "any.required": `"description" is required`,
    }),

  });


  /** Schema for updating category details */
  static updateCategorySchema: Schema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      "string.min": `"name" should have a minimum length of {#limit}`,
      "string.max": `"name" should have a maximum length of {#limit}`,
    }),
    description: Joi.string().min(10).optional().messages({
      "string.min": `"description" should have a minimum length of {#limit}`,
    }),
   
    })
    .or("name", "description") // At least one field required
      .messages({
      "object.missing": "At least one field must be provided for update",
    });


  /** Schema for deleting a category by ID */
    static deleteCategoryByIdSchema: Schema = Joi.object({
        id: Joi.string().uuid().required(),
    });

    static getCategoryByIdSchema: Schema = Joi.object({
        id: Joi.string().uuid().required(),
    });

    static getCategoryByNameSchema: Schema = Joi.object({
        name: Joi.string().min(2).max(100).required().messages({
            "string.min": `"name" should have a minimum length of {#limit}`,
            "string.max": `"name" should have a maximum length of {#limit}`,
            "any.required": `"name" is required`,
        }),
    });

};

