import express from 'express';
import {
    createBooking, getAllBooking,
    getBooking, updateBooking, getBookingCount,
    deleteBooking, getUserBookingCount,
    getMonthlyBookingStats, getMonthlyIncomeStats
} from '../controllers/bookingController.js';
import ensureAuthenticated from '../middleware/authMiddlewares.js';

const router = express.Router();

router.post('/', ensureAuthenticated, createBooking);
router.get('/:id', ensureAuthenticated, getBooking);
router.get('/', ensureAuthenticated, getAllBooking);
router.put('/:id', ensureAuthenticated, updateBooking);
router.delete('/:id', ensureAuthenticated, deleteBooking);
router.get('/user/:userId/count', getUserBookingCount);

//recien agregado
router.get('/count/:tourId', getBookingCount);
router.get('/stats/monthly', getMonthlyBookingStats);
router.get('/stats/income', getMonthlyIncomeStats);
export default router;