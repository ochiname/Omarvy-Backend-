// src/modules/payment/controller.ts
import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./service";
import { PaymentModel } from "./model";
import { knex } from "../../config/dbconnection";  

export class PaymentController {
  private service: PaymentService;

  constructor() {
    this.service = new PaymentService(new PaymentModel(knex));
  }

  async controller_initializePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.service_initializePayment(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async controller_verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.service_verifyPayment(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
