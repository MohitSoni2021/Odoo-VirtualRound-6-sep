import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { addToWishlist, listMyWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

router.get('/me', tokenValidations.verifyToken, listMyWishlist);
router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, addToWishlist);
router.delete('/:productId', tokenValidations.verifyToken, removeFromWishlist);

export default router;
