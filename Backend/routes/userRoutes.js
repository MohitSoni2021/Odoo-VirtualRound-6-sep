import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  listUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getMe,
  updateMe,
} from '../controllers/userController.js';

const router = express.Router();

// Admin-only
router.get('/', tokenValidations.verifyToken, requireRoles('admin'), listUsers);
router.get('/:id', tokenValidations.verifyToken, requireRoles('admin'), getUserById);
router.patch('/:id', tokenValidations.verifyToken, requireRoles('admin'), updateUserById);
router.delete('/:id', tokenValidations.verifyToken, requireRoles('admin'), deleteUserById);

// Authenticated user
router.get('/me/current', tokenValidations.verifyToken, getMe);
router.patch('/me/current', tokenValidations.verifyToken, updateMe);

export default router;
