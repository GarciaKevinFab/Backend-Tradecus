import express from 'express';
import {
    createBooking, getAllBooking,
    getBooking, updateBooking, getBookingCount,
    deleteBooking, getUserBookingCount,
    getMonthlyBookingStats, getMonthlyIncomeStats
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/:id', getBooking);
router.get('/', getAllBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/user/:userId/count', getUserBookingCount);

router.get('/count/:tourId', getBookingCount);
router.get('/stats/monthly', getMonthlyBookingStats);
router.get('/stats/income', getMonthlyIncomeStats);

export default router;
