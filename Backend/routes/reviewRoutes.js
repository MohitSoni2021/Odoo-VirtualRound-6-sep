import express from 'express';
import tokenValidations from '../middlewares/tokenValidations.js';
import { requireRoles } from '../middlewares/roleCheck.js';
import {
  upsertMyReview,
  listReviewsForProduct,
  listMyReviews,
  deleteMyReview,
  adminDeleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

const preserveBody = (req, res, next) => { req._origBody = req.body; next(); };
const mergePreservedBody = (req, res, next) => { req.body = { ...(req._origBody || {}), ...(req.body || {}) }; next(); };

// Public: list reviews for a product
router.get('/product/:productId', listReviewsForProduct);

// Authenticated user
router.get('/me', tokenValidations.verifyToken, listMyReviews);
router.post('/', preserveBody, tokenValidations.verifyToken, mergePreservedBody, upsertMyReview);
router.delete('/:productId', tokenValidations.verifyToken, deleteMyReview);

// Admin delete any review by id
router.delete('/admin/:id', tokenValidations.verifyToken, requireRoles('admin'), adminDeleteReview);

export default router;
