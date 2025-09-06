import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  createPayment,
  listMyPayments,
  listPaymentsByOrder,
  adminListPayments,
  adminUpdatePayment,
} from '../controllers/paymentController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Current user
router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, createPayment);
router.get('/me', tokenValidations.verifyToken, listMyPayments);
router.get('/order/:orderId', tokenValidations.verifyToken, listPaymentsByOrder);

// Admin
router.get('/', tokenValidations.verifyToken, requireRoles('admin'), adminListPayments);
router.patch('/:id', preserveBody, tokenValidations.verifyToken, requireRoles('admin'), mergePreservedBody, adminUpdatePayment);

export default router;
