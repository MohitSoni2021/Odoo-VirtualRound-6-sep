import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import {
  sendMessage,
  listMessagesWithUser,
  archiveMessage,
  unarchiveMessage,
  deleteMessage,
} from '../controllers/messageController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, sendMessage);
router.get('/with/:userId', tokenValidations.verifyToken, listMessagesWithUser);
router.patch('/:id/archive', tokenValidations.verifyToken, archiveMessage);
router.patch('/:id/unarchive', tokenValidations.verifyToken, unarchiveMessage);
router.delete('/:id', tokenValidations.verifyToken, deleteMessage);

export default router;
