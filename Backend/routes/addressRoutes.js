import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  listMyAddresses,
  createMyAddress,
  updateMyAddress,
  deleteMyAddress,
  makeMyAddressPrimary,
  listAddressesByUser,
} from '../controllers/addressController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Current user addresses
router.get('/me', tokenValidations.verifyToken, listMyAddresses);
router.post('/me', preserveBody, tokenValidations.verifyToken, mergePreservedBody, createMyAddress);
router.patch('/me/:id', preserveBody, tokenValidations.verifyToken, mergePreservedBody, updateMyAddress);
router.delete('/me/:id', tokenValidations.verifyToken, deleteMyAddress);
router.post('/me/:id/make-primary', tokenValidations.verifyToken, makeMyAddressPrimary);

// Admin: list by user
router.get('/user/:userId', tokenValidations.verifyToken, requireRoles('admin'), listAddressesByUser);

export default router;
