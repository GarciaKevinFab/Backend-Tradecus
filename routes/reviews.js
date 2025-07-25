import express from 'express';
import {
    createReview,
    getReviews,
    deleteReview,
    getReviewsByUser,
    getReviewStats
} from '../controllers/reviewController.js';

import ensureAuthenticated from '../middleware/authMiddlewares.js'; // 👈 importado correctamente

const router = express.Router();

// 🛡️ Protección de rutas que usan req.user
router.post('/:tourId', ensureAuthenticated, createReview); // ← AQUÍ estaba el problema
router.delete('/:reviewId', deleteReview); // opcional

router.get('/', getReviews);
router.get('/user/:userId', getReviewsByUser);
router.get('/stats', getReviewStats);

export default router;
