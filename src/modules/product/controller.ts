import { ProductService } from "./service";
import { Request, Response, NextFunction } from "express";
import {  UpdateProduct } from "./interface";


export class ProductController {
  private service: ProductService; 

  constructor() {
    this.service = new ProductService
();
  }

    async controller_createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const userData: UpdateProduct = req.body;
        const result = await this.service.service_createProduct(userData);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }


    async controller_getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_getProductById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getProductByName(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const name = req.params.name;
        const result = await this.service.service_getProductByName(name);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllProducts();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }         
    }

    async controller_UpdateProductById(req: Request, res: Response, next: NextFunction): Promise<void> {                   
        try {   
            const id = req.params.id;
            const updateData: Partial<UpdateProduct> = req.body;
            const result = await this.service.service_UpdateProductById(id, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }                   
    } 
   

    async controller_deleteProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_deleteProductById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }   
}