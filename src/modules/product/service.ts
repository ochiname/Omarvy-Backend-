import { ProductModel } from './model';
import { NewProduct, UpdateProduct } from './interface';
import { errors } from '../../middlewares/error';
import dotenv from 'dotenv';



dotenv.config();

export class ProductService {
    constructor(public model: ProductModel = new ProductModel()) {} // default model instance

    // ✅ service create user //////

   async service_createProduct(product: UpdateProduct): Promise<{ message: string; product: { id: string; name: string; category_id: string; description: string; price: number; }}> {
      // 1️⃣ Check if product with the same name already exists
      const existingProduct = await this.model.model_getProductByName(product.name);
      if (existingProduct) {
        throw errors.CONFLICT_DATA;
        console.log("Another product with this name exists");
      }

      const NewProduct = await this.model.model_createProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category_id: product.category_id,
            image_url: product.image_url,
            stock_quantity: product.stock_quantity,
            updated_at: new Date(),   
            created_at: new Date(),
      })

        console.log(`Product ${NewProduct.name} registered successfully.`);


      return { message: "Registered successfully", product: { 
        id: NewProduct.id,
        name: NewProduct.name,
        description: NewProduct.description,
        price: NewProduct.price,
        category_id: NewProduct.category_id,
        // image_url: NewProduct.image_url,
        // stock_quantity: NewProduct.stock_quantity,
        // updated_at: NewProduct.updated_at,
        // created_at: NewProduct.created_at,
      },
    };
  }

    //////  ✅ service get product ////////////

  async service_getProductByName(name: string): Promise<NewProduct | null> {
    if (!name) {
        console.log("Name is required — validation failed in service_getProductByName()");
        throw errors.UNAUTHORIZED;
      }

      return await this.model.model_getProductByName(name);
  } 

  async service_getProductById(id: string): Promise<NewProduct | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_getProductById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_getProductById(id);
  } 

  async service_getAllProducts(): Promise<NewProduct[]> {   
    return await this.model.model_getAllProducts();
  }



  ////////////////////// ✅ service update product ////////////
  async service_UpdateProductById(id: string, data: Partial<NewProduct>): Promise<NewProduct | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_UpdateProductById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_updateProductById(id, data);
  }
  
  ////////////////////// ✅ service delete product ////////////
  async service_deleteProductById(id: string): Promise<{ message: string }> {
    if (!id) {
        console.log("ID is required — validation failed in service_deleteProductById()");
        throw errors.UNAUTHORIZED;
      }
      await this.model.model_deleteProductById(id);
      return { message: "Product deleted successfully" };
    }


  }

