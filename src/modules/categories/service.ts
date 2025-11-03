import { CategoryModel } from './model';
import { NewCategory, UpdateCategory } from './interface';
import { errors } from '../../middlewares/error';
import dotenv from 'dotenv';



dotenv.config();

export class CategoryService {
    constructor(public model: CategoryModel = new CategoryModel()) {} // default model instance

    // ✅ service create user //////

   async service_createCategory(category: UpdateCategory): Promise<{ message: string; 
    category: { name: string; description: string; }}> {
      // 1️⃣ Check if category with the same name already exists
      const existingCategory = await this.model.model_getCategoryByName(category.name);
      if (existingCategory) {
        throw errors.CONFLICT_DATA;
        console.log("Another category with this name exists");
      }

      const NewCategory = await this.model.model_createCategory({
            name: category.name,
            description: category.description,
            updated_at: new Date(),   
            created_at: new Date(),
      })

        console.log(`Product ${NewCategory.name} registered successfully.`);


      return { message: "Registered successfully", category: { 
        name: NewCategory.name,
        description: NewCategory.description,
      }};
       
    };
 

    //////  ✅ service get category ////////////

  async service_getCategoryByName(name: string): Promise<UpdateCategory | null> {
    if (!name) {
        console.log("Name is required — validation failed in service_getCategoryByName()");
        throw errors.BAD_REQUEST;
      }

      return await this.model.model_getCategoryByName(name);
  } 

  async service_getCategoryById(id: string): Promise<NewCategory | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_getCategoryById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_getCategoryById(id);
  } 

  async service_getAllCategories(): Promise<NewCategory[]> {   
    return await this.model.model_getAllCategories();
  }



  ////////////////////// ✅ service update category ////////////
  async service_UpdateCategoryById(id: string, data: Partial<NewCategory>): Promise<NewCategory | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_UpdateCategoryById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_updateCategoryById(id, data);
  }

  ////////////////////// ✅ service delete category ////////////
  async service_deleteCategoryById(id: string): Promise<{ message: string }> {
    if (!id) {
        console.log("ID is required — validation failed in service_deleteCategoryById()");
        throw errors.UNAUTHORIZED;
      }
      await this.model.model_deleteCategoryById(id);
      return { message: "Category deleted successfully" };
    }


  }

