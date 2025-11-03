import { AuthService } from "./service";
import { CartService } from "../cart/service";
import { Request, Response, NextFunction } from "express";
import { NewUser, UpdateUser } from "./interface";
import { AuthenticatedRequest } from "../../middlewares/jwt_aunthenticator";


export class AuthController {
  private service: AuthService; 
  private cartService: CartService;

  constructor() {
    this.service = new AuthService();
    this.cartService = new CartService();
  }


    async controller_createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const sessionId = req.sessionID;
        const userData: UpdateUser = req.body;
        const result = await this.service.service_createUser(userData)

        this.cartService.service_mergeGuestCart(sessionId, result.user.id);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }

    async controller_login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, password } = req.body;
        const result = await this.service.service_login(email, password);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

}

    async controller_logout(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            console.log("No token found");
          return next(new Error('No token provided'));
        }   

        const result = await this.service.service_logout(token);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const email = req.params.email;
        const result = await this.service.service_getUserByEmail(email);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_getUserById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllUsers();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }         
    }

    async controller_updateUserbyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {                   
        try {   
            const email = req.params.email;
            const updateData: Partial<UpdateUser> = req.body;
            const result = await this.service.service_updateUserByEmail(email, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }                   
    } 
    
    async controller_updateUserbyId(req: Request, res: Response, next: NextFunction): Promise<void> {                   
        try {   
            const id = req.params.id;
            const updateData: Partial<UpdateUser> = req.body;
            const result = await this.service.service_updateUserById(id, updateData);
            res.status(200).json(result);       
        } catch (error) {
            next(error);
        }   
    }

    async controller_adminUpdateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {                   
        try {  
            if (req.authUser?.role !== 'admin') {
                return next(new Error('Forbidden: Admins only'));
            }

            const identifier: { id?: string; email?: string } = {};     
            if (req.params.id) {
                identifier.id = req.params.id;
            }

            if (req.params.email) {
                identifier.email = req.params.email;
            }

            const updateData: Partial<UpdateUser> = req.body;
            const result = await this.service.service_adminUpdateUser(identifier, updateData);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    
            
    }

    async controller_getAllAdmins(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllAdmins();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 

    }

    async controller_getAllCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const result = await this.service.service_getAllCustomers();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }

    }

    async controller_passwordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, oldPassword, newPassword } = req.body;
        const result = await this.service.service_changePassword(email, oldPassword, newPassword);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
}

    async controller_deleteUserbyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const email = req.params.email;
        const result = await this.service.service_deleteUserByEmail(email);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }

    async controller_deleteUserbyId(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = req.params.id;
        const result = await this.service.service_deleteUserById(id);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      } 
    }   
}