import { CategoryController } from './controller';
import { CategoryValidator } from './validator';
import express from 'express';
const categoryRouter = express.Router();
import { authenticateToken } from '../../middlewares/jwt_aunthenticator';


const controller = new CategoryController();
// Public routes
categoryRouter.post('/createCategory', authenticateToken, CategoryValidator.validate(CategoryValidator.createCategorySchema),
controller.controller_createCategory.bind(controller));


categoryRouter.get('/categories', authenticateToken, controller.controller_getAllCategories.bind(controller));

categoryRouter.get('/singlecategory/:id', authenticateToken,  CategoryValidator.validate(CategoryValidator.getCategoryByIdSchema),
  controller.controller_getCategoryById.bind(controller));


categoryRouter.get('/singlecategorybyname/:name', authenticateToken,  CategoryValidator.validate(CategoryValidator.getCategoryByNameSchema),
  controller.controller_getCategoryByName.bind(controller));

categoryRouter.put('/category/update/:id', authenticateToken, CategoryValidator.validate(CategoryValidator.updateCategorySchema),
  controller.controller_UpdateCategoryById.bind(controller)
);

categoryRouter.delete('/category/id/:id', authenticateToken,CategoryValidator.validate(CategoryValidator.deleteCategoryByIdSchema),
    controller.controller_deleteCategoryById.bind(controller));


export default categoryRouter;