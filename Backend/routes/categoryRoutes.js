import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from '../controllers/categoryController.js';

const router = express.Router();

// Public reads
router.get('/', listCategories);
router.get('/:id', getCategoryById);

// Admin-only writes
router.post('/', tokenValidations.verifyToken, requireRoles('admin'), createCategory);
router.patch('/:id', tokenValidations.verifyToken, requireRoles('admin'), updateCategoryById);
router.delete('/:id', tokenValidations.verifyToken, requireRoles('admin'), deleteCategoryById);

export default router;
