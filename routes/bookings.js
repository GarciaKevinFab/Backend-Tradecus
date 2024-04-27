import express from 'express';
import { createBooking, getAllBooking, getBooking, updateBooking, getBookingCount, deleteBooking } from '../controllers/bookingController.js';
import ensureAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', ensureAuthenticated, createBooking);
router.get('/:id', ensureAuthenticated, getBooking);
router.get('/', ensureAuthenticated, getAllBooking);
router.put('/:id', ensureAuthenticated, updateBooking);
router.delete('/:id', ensureAuthenticated, deleteBooking);

//recien agregado
router.get('/count/:tourId', getBookingCount);

export default router;