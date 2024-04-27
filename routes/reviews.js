import express from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:tourId', createReview);

// Ruta para obtener todas las revisiones de un tour específico
router.get('/', getReviews);

router.delete('/:reviewId', deleteReview);


export default router;