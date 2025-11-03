import { AuthController } from './controller';
import { AuthValidator } from './validator';
import express from 'express';
const deliveryRouter = express.Router();
import { authenticateToken, requireRole } from '../../middlewares/jwt_aunthenticator';


const controller = new AuthController();
// Public routes
deliveryRouter.post('/createDeliveryFee', authenticateToken, requireRole('admin'), 
AuthValidator.validate(AuthValidator.createDeliveryFeeSchema), controller.controller_createDeliveryFee.bind(controller));

deliveryRouter.get('/deliveryFee/location/:location', authenticateToken,
   AuthValidator.validate(AuthValidator.getDeliveryFeeByLocationSchema), controller.controller_getDeliveryFeeByLocation.bind(controller));

deliveryRouter.get('/deliveryFee/id/:id', authenticateToken,
   AuthValidator.validate(AuthValidator.getDeliveryFeeByIdSchema), controller.controller_getDeliveryFeeById.bind(controller));  

   deliveryRouter.get('/deliveryFees', authenticateToken, controller.controller_getAllDeliveryFees.bind(controller));

deliveryRouter.put('/deliveryFee/location/:location', authenticateToken, requireRole('admin'),
  AuthValidator.validate(AuthValidator.updateDeliveryFeeByLocationSchema),
  controller.controller_updateDeliveryFeeByLocation.bind(controller)
);

deliveryRouter.put('/deliveryFee/id/:id', authenticateToken, requireRole('admin'),
  AuthValidator.validate(AuthValidator.updateDeliveryFeeByIdSchema),
  controller.controller_updateDeliveryFeeById.bind(controller)
);


deliveryRouter.delete('/deliveryFee/delete/id/:id', authenticateToken, requireRole('admin'),
    AuthValidator.validate(AuthValidator.deleteDeliveryFeeByIdSchema),
    controller.controller_deleteDeliveryFeeById.bind(controller));

deliveryRouter.delete('/deliveryFee/delete/location/:location', authenticateToken, requireRole('admin'),  
    AuthValidator.validate(AuthValidator.deleteDeliveryFeeByLocationSchema),
    controller.controller_deleteDeliveryFeeByLocation.bind(controller));


export default deliveryRouter;