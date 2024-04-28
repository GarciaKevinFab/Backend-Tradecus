import express from 'express';
import { createBooking, getAllBooking, getBooking, updateBooking, getBookingCount, deleteBooking } from '../controllers/bookingController.js';
import ensureAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',  createBooking);
router.get('/:id',  getBooking);
router.get('/',  getAllBooking);
router.put('/:id',  updateBooking);
router.delete('/:id',  deleteBooking);

//recien agregado
router.get('/count/:tourId', getBookingCount);

export default router;
