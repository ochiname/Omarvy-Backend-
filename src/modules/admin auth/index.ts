import { AuthController } from './controller';
import { CartController } from '../cart/controller';
import { AuthValidator } from './validator';
import express from 'express';
const authrouter = express.Router();
import { authenticateToken } from '../../middlewares/jwt_aunthenticator';


const controller = new AuthController();
const cartController = new CartController();
// Public routes
authrouter.post('/register', AuthValidator.validate(AuthValidator.createUserSchema),controller.controller_createUser.bind(controller));

authrouter.post('/login', AuthValidator.validate(AuthValidator.loginSchema),controller.controller_login.bind(controller));

// Protected routes
authrouter.post('/logout', authenticateToken, controller.controller_logout.bind(controller));
authrouter.get('/user/:email', authenticateToken, controller.controller_getUserByEmail.bind(controller), 
cartController.controller_mergeGuestCart.bind(cartController));

authrouter.put('/admin/user',
  authenticateToken,
  AuthValidator.validate(AuthValidator.adminUpdateParamsSchema),
  AuthValidator.validate(AuthValidator.updateUserSchema),
  controller.controller_adminUpdateUser.bind(controller)
);

authrouter.get('/users', authenticateToken, controller.controller_getAllUsers.bind(controller));
authrouter.get('/admins', authenticateToken, controller.controller_getAllAdmins.bind(controller));
authrouter.get('/customers', authenticateToken, controller.controller_getAllCustomers.bind(controller));    

authrouter.put('/user/id/:id',
  authenticateToken,
  AuthValidator.validate(AuthValidator.updateUserSchema),
  controller.controller_updateUserbyId.bind(controller)
);      
authrouter.put('/user/email/:email',
  authenticateToken,
  AuthValidator.validate(AuthValidator.updateUserSchema),
  controller.controller_updateUserbyEmail.bind(controller)
);

authrouter.get('/user/id/:id', authenticateToken, controller.controller_getUserById.bind(controller));
authrouter.get('/user/email/:email', authenticateToken, controller.controller_getUserByEmail.bind(controller));


authrouter.post('/change-password',
  AuthValidator.validate(AuthValidator.changePasswordSchema),
  controller.controller_passwordReset.bind(controller)
);

authrouter.delete('/user/id/:id', authenticateToken,
    AuthValidator.validate(AuthValidator.deleteUserByIdSchema),
    controller.controller_deleteUserbyId.bind(controller));

authrouter.delete('/user/email/:email', authenticateToken,
    AuthValidator.validate(AuthValidator.deleteUserByEmailSchema),
    controller.controller_deleteUserbyEmail.bind(controller));


export default authrouter;