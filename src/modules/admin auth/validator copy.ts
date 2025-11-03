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

  /** Schema for registering a new user */
  static createUserSchema: Schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": `"email" must be a valid email address`,
      "any.required": `"email" is required`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": `"password" should have a minimum length of {#limit}`,
      "any.required": `"password" is required`,
    }),
    role: Joi.string().valid("customer", "admin").required().messages({
      "any.only": `"role" must be either 'user' or 'admin'`,
    }),
    full_name: Joi.string().required().messages({
      "any.required": `"full_name" is required`,
    }), 
    address: Joi.string().required().messages({
        "any.required": `"address" is required`,
    }),
    phone: Joi.string().required().messages({
        "any.required": `"phone" is required`,
    }),

  });

  /** Schema for user login */
  static loginSchema: Schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": `"email" must be a valid email address`,
      "any.required": `"email" is required`,
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": `"password" should have a minimum length of {#limit}`,
      "any.required": `"password" is required`,
    }),
  });

  static logoutSchema: Schema = Joi.object({
    token: Joi.string().required().messages({
      "any.required": `"token" is required`,
    }),
  });
  /** Schema for updating user details */
  static updateUserSchema: Schema = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid("user", "admin").optional(),
    full_name: Joi.string().optional(),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).or("email", "password", "role", "full_name", "address", "phone") // At least one field required
    .messages({
      "object.missing": "At least one field must be provided for update",
    });

    static adminUpdateParamsSchema = Joi.object({
      id: Joi.number().integer().positive().optional(),
      email: Joi.string().email().optional(),
    }).or("id", "email") // At least one identifier required
      .messages({
        "object.missing": "At least one identifier (id or email) must be provided",
      });


  /** Schema for resetting user password */
    static changePasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": `"email" must be a valid email address`,
        "any.required": `"email" is required`,
    }),

    oldPassword: Joi.string().min(8).required().messages({
        "string.min": `"oldPassword" must be at least {#limit} characters long`,
        "any.required": `"oldPassword" is required`,
    }),

    newPassword: Joi.string().min(8).required().disallow(Joi.ref("oldPassword")).messages({
        "string.min": `"newPassword" must be at least {#limit} characters long`,
        "any.required": `"newPassword" is required`,
        "any.invalid": `"newPassword" cannot be the same as old password`,
    }),
    });

  /** Schema for deleting a user by email */
    static deleteUserByEmailSchema: Schema = Joi.object({
        email: Joi.string().email().required(),
    });

    static deleteUserByIdSchema: Schema = Joi.object({
        id: Joi.number().integer().positive().required(),
    });

    static getUserByEmailSchema: Schema = Joi.object({
        email: Joi.string().email().required(),
    });

    static getUserByIdSchema: Schema = Joi.object({
    id: Joi.number().integer().positive().required(),
    }); 
}

