import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  createOrder,
  listMyOrders,
  getOrderById,
  adminListOrders,
  updateOrderStatus,
  cancelMyOrder,
} from '../controllers/orderController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Current user
router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, createOrder);
router.get('/me', tokenValidations.verifyToken, listMyOrders);
router.get('/:id', tokenValidations.verifyToken, getOrderById);
router.post('/:id/cancel', tokenValidations.verifyToken, cancelMyOrder);

// Admin
router.get('/', tokenValidations.verifyToken, requireRoles('admin'), adminListOrders);
router.patch('/:id/status', preserveBody, tokenValidations.verifyToken, requireRoles('admin'), mergePreservedBody, updateOrderStatus);

export default router;
