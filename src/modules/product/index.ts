import { ProductController } from './controller';
import { ProductValidator } from './validator';
import express from 'express';
const productRouter = express.Router();
import { authenticateToken } from '../../middlewares/jwt_aunthenticator';


const controller = new ProductController();
// Public routes
productRouter.post('/createProduct', authenticateToken, ProductValidator.validate(ProductValidator.createProductSchema),
controller.controller_createProduct.bind(controller));


productRouter.get('/allProducts', authenticateToken, controller.controller_getAllProducts.bind(controller));

productRouter.get('/singleproduct/:id', authenticateToken,  ProductValidator.validate(ProductValidator.getProductByIdSchema),
  controller.controller_getProductById.bind(controller));


productRouter.get('/singleproductbyname/:name', authenticateToken,  ProductValidator.validate(ProductValidator.getProductByNameSchema),
  controller.controller_getProductByName.bind(controller));

productRouter.put('/product/update/:id', authenticateToken, ProductValidator.validate(ProductValidator.updateProductSchema),
  controller.controller_UpdateProductById.bind(controller)
);

productRouter.delete('/product/id/:id', authenticateToken,ProductValidator.validate(ProductValidator.deleteProductByIdSchema),
    controller.controller_deleteProductById.bind(controller));


export default productRouter;