import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateProduct, NewProduct } from "./interface";
// import { promises } from 'dns';

export class ProductModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new product/////////////////
    async model_createProduct(product: UpdateProduct): Promise<NewProduct> {
      const [newProduct] = await this.db<NewProduct>('products')
        .insert(product)
        .returning('*');
      return newProduct;
    }  


    ///////////////////read product data by id//////////////////
    async model_getProductById(id: string): Promise<NewProduct | null> {
      const product = await this.db<NewProduct>('products')
        .where({ id })
        .first();
      return product || null;
    }

    async model_getProductByName(name: string): Promise<NewProduct | null> {
      const product = await this.db<NewProduct>('products')
        .where({ name })
        .first();
      return product || null;
    }

    ////////////////////////////////////////////get all products/////////////////////
    async model_getAllProducts(): Promise<NewProduct[]> {
      return this.db<NewProduct>('products').select('*');
    }

    ///////////////////// Update product details/////////////////////
    async model_updateProductById(id: string, data: Partial<NewProduct>): Promise<NewProduct | null> {
      const [updatedProduct] = await this.db<NewProduct>('products')
        .where({ id })
        .update(data)
        .returning('*');
      return updatedProduct || null;
    }


  ////////////////////////// delete product ////////////////////////

    async model_deleteProductById(id: string): Promise<boolean> {
      const rowsAffected = await this.db<NewProduct>('products')
        .where({ id })  
        .del();

      return rowsAffected > 0;
    }


}