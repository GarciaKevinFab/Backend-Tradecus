import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true },
    user: { type: Object, required: true },
    tourId: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    booking: { type: Object, required: true },
    dni: { type: [String], required: true },
    userData: { type: [Object], required: true },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
