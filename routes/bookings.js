import express from 'express';
import {
    createBooking, getAllBooking,
    getBooking, updateBooking, getBookingCount,
    deleteBooking, getUserBookingCount,
    getMonthlyBookingStats, getMonthlyIncomeStats,
    getDailyIncomeStats,
    getUserBookings,
    getDailyBookingStats,
    getFortnightBookingStats,
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);

router.get('/user/:userId/count', getUserBookingCount);
router.get('/user/:userId', getUserBookings);

router.get('/count/:tourId', getBookingCount);

// Ahora recién las rutas dinámicas generales:
router.get('/:id', getBooking);

router.get('/', getAllBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

// ...el resto igual
router.get('/stats/monthly', getMonthlyBookingStats);
router.get('/stats/income', getMonthlyIncomeStats);
router.get('/stats/income/daily', getDailyIncomeStats);
router.get('/stats/income/fortnight', getFortnightIncomeStats);
router.get('/stats/bookings/daily', getDailyBookingStats);
router.get('/stats/bookings/fortnight', getFortnightBookingStats);

export default router;
