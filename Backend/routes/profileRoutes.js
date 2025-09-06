import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getProfileByUserId,
} from '../controllers/profileController.js';

const router = express.Router();

// Current user profile
router.post('/me', tokenValidations.verifyToken, createMyProfile);
router.get('/me', tokenValidations.verifyToken, getMyProfile);
router.patch('/me', tokenValidations.verifyToken, updateMyProfile);
router.delete('/me', tokenValidations.verifyToken, deleteMyProfile);

// Admin: get profile by userId
router.get('/:userId', tokenValidations.verifyToken, requireRoles('admin'), getProfileByUserId);

export default router;
