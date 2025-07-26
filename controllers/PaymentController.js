import mercadopago from "mercadopago";
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const createPayment = async (req, res) => {
    try {
        const { user, tourId, quantity, totalPrice, booking, dni, userData, googlePayToken } = req.body;

        // 1. Procesa el cobro real con MP usando el token de Google Pay
        const payment_data = {
            transaction_amount: totalPrice,
            token: googlePayToken,
            description: `Pago por tour ${tourId}`,
            installments: 1,
            payment_method_id: 'visa', // o "master", MP lo deduce del token
            payer: {
                email: user.email,
            },
        };

        const mpResponse = await mercadopago.payment.create(payment_data);

        // 2. Valida la respuesta de MP
        if (mpResponse.body.status !== "approved") {
            return res.status(400).json({ success: false, message: 'Pago NO aprobado', mp: mpResponse.body });
        }

        // 3. Guarda el booking solo si el pago fue exitoso
        const newBooking = await Booking.create({
            userId: user._id,
            userEmail: user.email,
            tourName: booking.tourName,
            tourType: booking.tourType || "group",
            guestSize: booking.guestSize,
            phone: booking.phone,
            bookAt: booking.bookAt,
            userData,
        });

        // 4. Guarda el pago
        const newPayment = new Payment({
            paymentId: mpResponse.body.id,
            status: mpResponse.body.status,
            user,
            tourId,
            quantity,
            totalPrice,
            booking: newBooking,
            dni,
            userData,
        });

        await newPayment.save();

        res.json({ success: true, paymentId: newPayment._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
