import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

export const createPayment = async (req, res) => {
    try {
        const { user, tourId, quantity, totalPrice, booking, dni, userData, paymentResult } = req.body;

        // ✅ Guarda el booking correctamente
        const newBooking = await Booking.create({
            userId: user._id,
            userEmail: user.email,
            tourName: booking.tourName,
            tourType: booking.tourType || "group", // Agrega esto si se te olvidó en el frontend
            guestSize: booking.guestSize,
            phone: booking.phone,
            bookAt: booking.bookAt,
            userData,
        });

        // ✅ Guarda el pago con referencia al booking
        const newPayment = new Payment({
            paymentId: paymentResult?.transactionId || `payment-${Date.now()}`, // por si no viene
            user,
            tourId,
            quantity,
            totalPrice,
            booking: newBooking, // objeto de booking real
            dni,
            userData,
        });

        await newPayment.save();

        res.json({ success: true, paymentId: newPayment._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
