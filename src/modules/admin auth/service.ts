import { AuthModel } from './model';
import { NewUser, UpdateUser } from './interface';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { errors } from '../../middlewares/error';
import redisClient from '../../config/redisClient'; 
import { Knex } from 'knex';
import dotenv from 'dotenv';


dotenv.config();

export class AuthService {
    constructor(public model: AuthModel = new AuthModel()) {} // default model instance

    private jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret'; // fallback if env not set
   
  // ✅ Generate JWT token
    async generateToken(user: NewUser): Promise<string> {
        if (!this.jwtSecret) {
        throw errors.UNAUTHORIZED; // Custom error for missing secret
        console.log('no jwt secret');
        }

        const payload = {
        id: user.id,
        role: user.role,
        email: user.email,
        };

        // ✅ Recommended: use environment variable for token expiration
        const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'] };
        return jwt.sign(payload, this.jwtSecret as jwt.Secret, options);
    }

    // ✅ Hash password before storing
    async hashPassword(password: string): Promise<string> {
      const saltRounds = 10; // Recommended minimum
      return bcrypt.hash(password, saltRounds);
    }


    // ✅ service create user //////
  async service_createUser(user: UpdateUser): Promise<{ message: string; user: { id: string; email: string; role: string; full_name: string; address: string; phone: string;  }; token: string; }> {
      // 1️⃣ Check if user with the same email already exists
      const existingUser = await this.model.model_getUserByEmail(user.email);
      if (existingUser) {
        throw errors.CONFLICT_DATA
        console.log("Another user with this email exixt");
      } 

      const newUser = await this.model.model_createUser({
            email: user.email,
            full_name: user.full_name,
            password: await this.hashPassword(user.password),
            role: 'customer',
            // account_status: 'active',
            address: user.address,
            phone: user.phone,
            created_at: new Date(),
      })

        console.log(`User ${newUser.email} registered successfully.`);

        const token = await this.generateToken(newUser);
      
      
      
      return { message: "Registered successfully", user: { 
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        full_name: newUser.full_name,
        address: newUser.address,
        phone: newUser.phone,
        // account_status: newUser.account_status
         },
        token,
    };
  }

    //////  ✅ service logout ////////////

  async service_logout(token: string): Promise<{ message: string }> {
      if (!token) throw errors.INVALID_TOKEN;

      try {
        const decoded = jwt.verify(token, this.jwtSecret) as any;
        console.log(`User ${decoded.id} logged out successfully.`);

        // 🛑 Add the token to a Redis blacklist
        // Get token expiration time from decoded payload (in seconds)
        const exp = decoded.exp;
        const now = Math.floor(Date.now() / 1000);
        const ttl = exp ? exp - now : 3600; // fallback to 1 hour if missing exp

        await redisClient.set(`blacklist:${token}`, 'true', { EX: ttl });

        return { message: 'Logged out successfully' };
      } catch (err) {
        console.error('Invalid or expired token during logout:', err);
        throw errors.UNAUTHORIZED;
      }

  }

  async service_login(email: string, password: string): Promise<{ message: string; user: { id: string; email: string; role: string; full_name: string; address: string; phone: string; }; token: string; }> {
      // 1️⃣ Retrieve user by email
      const user = await this.model.model_getUserByEmail(email);
      if (!user) {
        throw errors.UNAUTHORIZED;
        console.log("No user found with this email");
      }
      // 2️⃣ Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);  
      if (!isPasswordValid) {
        throw errors.UNAUTHORIZED;
        console.log("Invalid password");
      } 
      // 3️⃣ Generate JWT token
      const token = await this.generateToken(user);
      console.log(`User ${user.email} logged in successfully.`);    
      return { message: "Logged in successfully", user: { 
        id: user.id,
        email: user.email,  
        role: user.role,
        full_name: user.full_name,
        address: user.address,
        phone: user.phone,  
        // account_status: user.account_status
        },
        token,
    };
  }


  async service_getUserByEmail(email: string): Promise<NewUser | null> {
    if (!email) {
        console.log("Email is required — validation failed in service_getUserByEmail()");
        throw errors.UNAUTHORIZED;
      }

      return await this.model.model_getUserByEmail(email);
  } 

  async service_getUserById(id: string): Promise<NewUser | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_getUserById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_getUserById(id);
  } 

  async service_getAllUsers(): Promise<NewUser[]> {   
    return await this.model.model_getAllUsers();
  }
  async service_getAllAdmins(): Promise<NewUser[]> {   
    return await this.model.model_getAllAdmins();
  } 
  async service_getAllCustomers(): Promise<NewUser[]> {   
    return await this.model.model_getAllCustomers();  
  } 

  async service_updateUserById(id: string, data: Partial<NewUser>): Promise<NewUser | null> {
    if (!id) {
        console.log("ID is required — validation failed in service_updateUserById()");
        throw errors.UNAUTHORIZED;
      }   
      return await this.model.model_updateUserById(id, data);
  }
  async service_updateUserByEmail(email: string, data: Partial<UpdateUser>): Promise<NewUser | null> {
    if (!email) {
        console.log("Email is required — validation failed in service_updateUserByEmail()");
        throw errors.UNAUTHORIZED;
      }     
      return await this.model.model_updateUserByEmail(email, data);
  } 

  async service_adminUpdateUser(
    identifier: { id?: string; email?: string },
    data: Partial<UpdateUser>
  ): Promise<NewUser | null> {
    if (!identifier.id && !identifier.email) {
      throw new Error("Must provide either id or email to identify the user");
    }
    return this.model.adminUpdateUser(identifier, data);
  }   

  async service_changePassword(email: string, oldPassword: string, newPassword: string): Promise<{ message: string }> {
    // 1️⃣ Retrieve user by email
    const user = await this.model.model_getUserByEmail(email);
    if (!user) {
      throw errors.UNAUTHORIZED;
      console.log("No user found with this email");
    }   
    // 2️⃣ Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);  
    if (!isOldPasswordValid) {
      throw errors.UNAUTHORIZED;
      console.log("Old password is incorrect");
    }
    // 3️⃣ Hash new password and update
    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.model.model_updateUserByEmail(email, { password: hashedNewPassword });
    console.log(`User ${user.email} changed password successfully.`);   
    return { message: "Password changed successfully" };
  }


  async service_forgotPassword(email: string, newPassword: string): Promise<{ message: string }> {
    // 1️⃣ Retrieve user by email
    const user = await this.model.model_getUserByEmail(email);  
    if (!user) {
      throw errors.UNAUTHORIZED;
      console.log("No user found with this email");
    }

    // 2️⃣ Hash new password and update
    const hashedNewPassword = await this.hashPassword(newPassword);
    await this.model.model_updateUserByEmail(email, { password: hashedNewPassword });
    console.log(`User ${user.email} reset password successfully.`);
    return { message: "Password reset successfully" };
  }   

  async service_deleteUserById(id: string): Promise<{ message: string }> {
    if (!id) {
        console.log("ID is required — validation failed in service_deleteUserById()");
        throw errors.UNAUTHORIZED;
      }
      await this.model.model_deleteUserById(id);
      return { message: "User deleted successfully" };
    }

  async service_deleteUserByEmail(email: string): Promise<{ message: string }> {
    if (!email) {
        console.log("Email is required — validation failed in service_deleteUserByEmail()");
        throw errors.UNAUTHORIZED;
      } 
      await this.model.model_deleteUserByEmail(email);
      return { message: "User deleted successfully" };
    }

  async service_adminDeleteUser(identifier: { id?: string; email?: string }): Promise<{ message: string }> {
    if (!identifier.id && !identifier.email) {
      throw new Error("Must provide either id or email to identify the user");
    }

    await this.model.model_adminDeleteUserByIdOrEmail(identifier);
    return { message: "User deleted successfully" };
  }

}