import express from 'express';
import {
    createBooking,
    getAllBooking,
    getBooking,
    updateBooking,
    getBookingCount,
    deleteBooking,
    getUserBookingCount,
    getMonthlyBookingStats,
    getMonthlyIncomeStats,
    getDailyIncomeStats,
    getUserBookings,
    getDailyBookingStats,
    getFortnightBookingStats,
    getFortnightIncomeStats // ¡AQUÍ ESTÁ EL IMPORTANTE!
} from '../controllers/bookingController.js';

const router = express.Router();

// Estadísticas primero, para que no las capture la ruta dinámica
router.get('/stats/monthly', getMonthlyBookingStats);
router.get('/stats/income', getMonthlyIncomeStats);
router.get('/stats/income/daily', getDailyIncomeStats);
router.get('/stats/income/fortnight', getFortnightIncomeStats);
router.get('/stats/bookings/daily', getDailyBookingStats);
router.get('/stats/bookings/fortnight', getFortnightBookingStats);

// Funcionalidad por usuario
router.get('/user/:userId/count', getUserBookingCount);
router.get('/user/:userId', getUserBookings);

// Booking count por tour
router.get('/count/:tourId', getBookingCount);

// CRUD básico
router.post('/', createBooking);
router.get('/', getAllBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/:id', getBooking); // SIEMPRE al final

export default router;
