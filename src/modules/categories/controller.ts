import { CategoryService } from "./service";
import { Request, Response, NextFunction } from "express";
import {  UpdateCategory } from "./interface";


export class CategoryController {
  private service: CategoryService; 

  constructor() {
    this.service = new CategoryService();
  }

    async controller_createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const userData: UpdateCategory = req.body;
        const result = await this.service.service_createCategory(userData);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }


    async controller_getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_getCategoryById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getCategoryByName(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const name = req.params.name;
        const result = await this.service.service_getCategoryByName(name);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllCategories();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }         
    }

    async controller_UpdateCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {                   
        try {   
            const id = req.params.id;
            const updateData: Partial<UpdateCategory> = req.body;
            const result = await this.service.service_UpdateCategoryById(id, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }                   
    } 
   

    async controller_deleteCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_deleteCategoryById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }   
}