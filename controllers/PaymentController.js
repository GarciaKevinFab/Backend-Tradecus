import Payment from '../models/Payment.js';

export const createPayment = async (req, res) => {
    try {
        const { user, tourId, quantity, totalPrice, booking, dni, userData, paymentResult } = req.body;

        const newPayment = new Payment({
            paymentId: paymentResult.transactionId, // Asegúrate de que este campo exista
            user,
            tourId,
            quantity,
            totalPrice,
            booking,
            dni,
            userData,
        });

        await newPayment.save();

        res.json({ success: true, paymentId: newPayment._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
