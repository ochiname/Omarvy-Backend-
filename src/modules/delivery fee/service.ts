import { DeliveryFeeModel } from './model';
import { NewDeliveryFee, UpdateDeliveryFee } from './interface';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { errors } from '../../middlewares/error';
import redisClient from '../../config/redisClient'; 
import { Knex } from 'knex';
import dotenv from 'dotenv';


dotenv.config();

export class DeliveryFeeService {
    constructor(public model: DeliveryFeeModel = new DeliveryFeeModel()) {} // default model instance

    // ✅ service create user //////
  async service_createDeliveryFee(deliveryFee: UpdateDeliveryFee): Promise<{ message: string; deliveryFee: { id: string; location: string; fee: number; }; }> {
      // 1️⃣ Check if delivery fee for the same location already exists
      const existingDeliveryFee = await this.model.model_getDeliveryFeeByLocation(deliveryFee.location);
      if (existingDeliveryFee) {
        throw errors.CONFLICT_DATA
        console.log("Another delivery fee for this location exists");
      }

      const newDeliveryFee = await this.model.model_createDeliveryFee({
            location: deliveryFee.location,
            fee: deliveryFee.fee,
            created_at: new Date(),
            updated_at: new Date(),
      })

      console.log(`Delivery fee for ${newDeliveryFee.location} created successfully.`);

      return { message: "Delivery fee created successfully", deliveryFee: newDeliveryFee };
  }


  async service_getDeliveryFeeByLocation(location: string): Promise<{ message: string; deliveryFee: NewDeliveryFee | null }> {
    if (!location) {
      throw errors.INVALID_CREDENTIALS;
    }
    const deliveryFee = await this.model.model_getDeliveryFeeByLocation(location);
    return { message: "Delivery fee retrieved successfully", deliveryFee };
  }

  async service_getDeliveryFeeById(id: string): Promise<{ message: string; deliveryFee: NewDeliveryFee | null }> {
    if (!id) {
      throw errors.INVALID_CREDENTIALS;
    }
    const deliveryFee = await this.model.model_getDeliveryFeeById(id);
    return { message: "Delivery fee retrieved successfully", deliveryFee };
  }

  async service_getAllDeliveryFees(): Promise<{ message: string; deliveryFees: NewDeliveryFee[] }> {
    const deliveryFees = await this.model.model_getAllDeliveryFees();
    return { message: "All delivery fees retrieved successfully", deliveryFees };
  }



  async service_UpdateDeliveryFeeById(id: string, data: Partial<NewDeliveryFee>): Promise<NewDeliveryFee | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_UpdateDeliveryFeeById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model. model_updateDeliveryFeeById(id, data);
  }

  async service_UpdateDeliveryFeeByLocation(location: string, data: Partial<UpdateDeliveryFee>): Promise<NewDeliveryFee | null> {
    if (!location) {
        console.log("Location is required — validation failed in service_UpdateDeliveryFeeByLocation()");
        throw errors.UNAUTHORIZED;
      }     
      return await this.model.model_updateDeliveryFeeByLocation(location, data);
  } 

  async service_deleteDeliveryFeeById(id: string): Promise<{ message: string }> {
    if (!id) {
        console.log("ID is required — validation failed in service_deleteDeliveryFeeById()");
        throw errors.UNAUTHORIZED;
      }
      await this.model.model_deleteDeliveryFeeById(id);
      return { message: "Delivery fee deleted successfully" };
    }

  async service_deleteDeliveryFeeByLocation(location: string): Promise<{ message: string }> {
    if (!location) {
        console.log("Location is required — validation failed in service_deleteDeliveryFeeByLocation()");
        throw errors.UNAUTHORIZED;
      } 
      await this.model.model_deleteDeliveryFeeByLocation(location);
      return { message: "Delivery fee deleted successfully" };
    }

}