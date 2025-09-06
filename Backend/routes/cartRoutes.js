import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  getMyCart,
  addItemToMyCart,
  updateMyCartItemQty,
  removeMyCartItem,
  clearMyCart,
  getCartByUserId,
} from '../controllers/cartController.js';

const router = express.Router();

// Helpers to preserve body due to token middleware overwriting req.body
const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Current user cart
router.get('/me', tokenValidations.verifyToken, getMyCart);
router.post('/me/items', preserveBody, tokenValidations.verifyToken, mergePreservedBody, addItemToMyCart);
router.patch('/me/items/:productId', preserveBody, tokenValidations.verifyToken, mergePreservedBody, updateMyCartItemQty);
router.delete('/me/items/:productId', tokenValidations.verifyToken, removeMyCartItem);
router.delete('/me', tokenValidations.verifyToken, clearMyCart);

// Admin: get cart by userId
router.get('/user/:userId', tokenValidations.verifyToken, requireRoles('admin'), getCartByUserId);

export default router;
