import {  DeliveryFeeService } from "./service";
import { Request, Response, NextFunction } from "express";
import {  UpdateDeliveryFee } from "./interface";


export class AuthController {
  private service:  DeliveryFeeService; 
  // private cartService: CartService;

  constructor() {
    this.service = new  DeliveryFeeService();
    // this.cartService = new CartService();
  }


    async controller_createDeliveryFee(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const deliveryFeeData: UpdateDeliveryFee = req.body;
        const result = await this.service.service_createDeliveryFee(deliveryFeeData)
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }

   

    async controller_getDeliveryFeeByLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const location = req.params.location;
        const result = await this.service.service_getDeliveryFeeByLocation(location);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getDeliveryFeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_getDeliveryFeeById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getAllDeliveryFees(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllDeliveryFees();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }         
    }

    async controller_updateDeliveryFeeByLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {   
            const location = req.params.location;
            const updateData: Partial<UpdateDeliveryFee> = req.body;
            const result = await this.service.service_UpdateDeliveryFeeByLocation(location, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }                   
    } 

    async controller_updateDeliveryFeeById(req: Request, res: Response, next: NextFunction): Promise<void> {                   
        try {   
            const id = req.params.id;
            const updateData: Partial<UpdateDeliveryFee> = req.body;
            const result = await this.service.service_UpdateDeliveryFeeById(id, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }   
    }


    async controller_deleteDeliveryFeeByLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const location = req.params.location;
        const result = await this.service.service_deleteDeliveryFeeByLocation(location);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }

    async controller_deleteDeliveryFeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_deleteDeliveryFeeById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }   
}