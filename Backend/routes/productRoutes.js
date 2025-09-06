import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../controllers/productController.js';

const router = express.Router();

// Helper middlewares to preserve body across token validation
const preserveBody = (req, res, next) => {
  req._origBody = req.body;
  next();
};
const mergePreservedBody = (req, res, next) => {
  req.body = { ...(req._origBody || {}), ...(req.body || {}) };
  next();
};

// Public reads
router.get('/', listProducts);
router.get('/:id', getProductById);

// Authenticated writes (owner/admin enforced in controller)
router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, createProduct);
router.patch('/:id', preserveBody, tokenValidations.verifyToken, mergePreservedBody, updateProductById);
router.delete('/:id', tokenValidations.verifyToken, deleteProductById);

export default router;
