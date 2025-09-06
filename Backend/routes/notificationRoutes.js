import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  listMyNotifications,
  markRead,
  markUnread,
  deleteMyNotification,
  adminCreateNotification,
  adminCreateBulk,
} from '../controllers/notificationController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Current user
router.get('/me', tokenValidations.verifyToken, listMyNotifications);
router.patch('/:id/read', tokenValidations.verifyToken, markRead);
router.patch('/:id/unread', tokenValidations.verifyToken, markUnread);
router.delete('/:id', tokenValidations.verifyToken, deleteMyNotification);

// Admin
router.post('/', preserveBody, tokenValidations.verifyToken, requireRoles('admin'), mergePreservedBody, adminCreateNotification);
router.post('/bulk', preserveBody, tokenValidations.verifyToken, requireRoles('admin'), mergePreservedBody, adminCreateBulk);

export default router;
