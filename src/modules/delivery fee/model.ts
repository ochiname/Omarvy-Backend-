import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateDeliveryFee, NewDeliveryFee } from "./interface";

export class DeliveryFeeModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new user/////////////////
    async model_createDeliveryFee(deliveryFee: UpdateDeliveryFee): Promise<NewDeliveryFee> {
      const [newDeliveryFee] = await this.db<NewDeliveryFee>('delivery_fees')
        .insert(deliveryFee)
        .returning('*');
      return newDeliveryFee;
    }  
    
    // read user data

    async model_getAllDeliveryFees(): Promise<NewDeliveryFee[]> {
      return this.db<NewDeliveryFee>('delivery_fees')
      .select('*');
    } 

    async model_getDeliveryFeeByLocation(location: string): Promise<NewDeliveryFee | null> {
      const deliveryFee = await this.db<NewDeliveryFee>('delivery_fees')
        .where({ location })
        .first();
      return deliveryFee || null;
    }

    async model_getDeliveryFeeById(id: string): Promise<NewDeliveryFee | null> {
      const deliveryFee = await this.db<NewDeliveryFee>('delivery_fees')
        .where({ id })
        .first();
      return deliveryFee || null;
    }

    ///////////////////// Update delivery fee/////////////////////
    async model_updateDeliveryFeeById(id: string, data: Partial<NewDeliveryFee>): Promise<NewDeliveryFee | null> {
      const [updatedDeliveryFee] = await this.db<NewDeliveryFee>('delivery_fees')
        .where({ id })
        .update(data)
        .returning('*');
      return updatedDeliveryFee || null;
    }       

    async model_updateDeliveryFeeByLocation(location: string, data: Partial<UpdateDeliveryFee>): Promise<NewDeliveryFee | null> {
      const [updatedDeliveryFee] = await this.db<NewDeliveryFee>('delivery_fees')
        .where({ location })
        .update(data)
        .returning('*');
      return updatedDeliveryFee || null;
    }


  ////////////////////////// delete delivery fee ////////////////////////

  async model_deleteDeliveryFeeById(id: string): Promise<boolean> {
    const rowsAffected = await this.db<NewDeliveryFee>('delivery_fees')
      .where({ id })
      .del();

    return rowsAffected > 0;
  }

  async model_deleteDeliveryFeeByLocation(location: string): Promise<boolean> {
    const rowsAffected = await this.db<NewDeliveryFee>('delivery_fees')
      .where({ location })
      .del();
    return rowsAffected > 0;
  } 

}