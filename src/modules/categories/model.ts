import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateCategory, NewCategory } from "./interface";
// import { promises } from 'dns';

export class CategoryModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new category/////////////////
    async model_createCategory(category: UpdateCategory): Promise<UpdateCategory> {
      const [UpdateCategory] = await this.db<UpdateCategory>('categories')
        .insert(category)
        .returning('*');
      return UpdateCategory;
    }


    ///////////////////read category data by id//////////////////
    async model_getCategoryById(id: string): Promise<NewCategory | null> {
      const category = await this.db<NewCategory>('categories')
        .where({ id })
        .first();
      return category || null;
    }

    async model_getCategoryByName(name: string): Promise<UpdateCategory | null> {
      const category = await this.db<UpdateCategory>('categories')
        .where({ name })
        .first();
      return category || null;
    }

    ////////////////////////////////////////////get all categories/////////////////////
    async model_getAllCategories(): Promise<NewCategory[]> {
      return this.db<NewCategory>('categories').select('*');
    }

    ///////////////////// Update category details/////////////////////
    async model_updateCategoryById(id: string, data: Partial<NewCategory>): Promise<NewCategory | null> {
      const [updatedCategory] = await this.db<NewCategory>('categories')
        .where({ id })
        .update(data)
        .returning('*');
      return updatedCategory || null;
    }


  ////////////////////////// delete category ////////////////////////

    async model_deleteCategoryById(id: string): Promise<boolean> {
      const rowsAffected = await this.db<NewCategory>('categories')
        .where({ id })
        .del();

      return rowsAffected > 0;
    }


}