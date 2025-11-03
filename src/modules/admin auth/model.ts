import { Knex } from 'knex';
import { knex } from '../../config/dbconnection';
import { UpdateUser, NewUser } from "./interface";
import { SrvRecord } from 'dns';
// import { promises } from 'dns';

export class AuthModel {
  constructor(public db: Knex = knex) {} // default db instance

    //////////////////// Create a new user/////////////////
    async model_createUser(user: UpdateUser): Promise<NewUser> {
      const [newUser] = await this.db<NewUser>('users')
        .insert(user)
        .returning('*');
      return newUser;
    }  
    
    // read user data
    async model_getUserByEmail(email: string): Promise<NewUser | null> {
      const user = await this.db<NewUser>('users')
        .where({ email })
        .first();
      return user || null;
    }

    ///////////////////read user data by id//////////////////
    async model_getUserById(id: string): Promise<NewUser | null> {
      const user = await this.db<NewUser>('users')
        .where({ id })
        .first();
      return user || null;
    }

    async model_getAllUsers(): Promise<NewUser[]> {
      return this.db<NewUser>('users').select('*');
    }

    async model_getAllAdmins(): Promise<NewUser[]> {
      return this.db<NewUser>('users').where('role', 'admin').select('*');
    }   

    async model_getAllCustomers(): Promise<NewUser[]> {
      return this.db<NewUser>('users').where('role', 'customer').select('*');
    }   

    ///////////////////// Update user details/////////////////////
    async model_updateUserById(id: string, data: Partial<NewUser>): Promise<NewUser | null> {
      const [updatedUser] = await this.db<NewUser>('users')
        .where({ id })  
        .update(data)
        .returning('*');
      return updatedUser || null;
    }       

    async model_updateUserByEmail(email: string, data: Partial<UpdateUser>): Promise<NewUser | null> {
    // 1️⃣ Prevent updating protected fields
    const { role, email: newEmail, ...safeData } = data;

    // 2️⃣ Perform the update
    const [updatedUser] = await this.db<NewUser>("users")
      .where({ email })
      .update(safeData)
      .returning("*");

    return updatedUser || null;
    }

    async adminUpdateUser(
    identifier: { id?: string; email?: string },
    data: Partial<UpdateUser>
  ): Promise<NewUser | null> {
    if (!identifier.id && !identifier.email) {
      throw new Error("Must provide either id or email to identify the user");
    }

    // 1️⃣ Protect immutable fields
    const safeData = { ...data } as Partial<UpdateUser>;
    // remove id if present on the incoming object (guard against malicious payload)
    delete (safeData as any).id;

    // 2️⃣ Build query
    let query = this.db<NewUser>("users");
    if (identifier.id) query = query.where({ id: identifier.id });
    if (identifier.email) query = query.where({ email: identifier.email });

    // 3️⃣ Perform update
    const [updatedUser] = await query.update(safeData).returning("*");

    return updatedUser || null;
    }


  ////////////////////////// delete user ////////////////////////

  async model_deleteUserById(id: string): Promise<boolean> {
    const rowsAffected = await this.db<NewUser>('users')
      .where({ id })  
      .del();

    return rowsAffected > 0;
  }

  async model_deleteUserByEmail(email: string): Promise<boolean> {
    const rowsAffected = await this.db<NewUser>('users')
      .where({ email })  
      .del();   
    return rowsAffected > 0;
  } 

  async model_deleteUserByRole(role: 'admin' | 'customer'): Promise<number> {
    const rowsAffected = await this.db<NewUser>('users')
      .where({ role: "admin"})    
      .del();

    return rowsAffected;
  }
  async model_adminDeleteUserByIdOrEmail(identifier: { id?: string; email?: string }): Promise<number> {
    let query = this.db<NewUser>('users').delete();

    if (identifier.id) {
      query = query.where({ id: identifier.id });
    } else if (identifier.email) {
      query = query.where({ email: identifier.email });
    } else {
      throw new Error("Must provide either id or email to identify the user");
    }

    const result = await query;
    return result;
  }

}