import mercadopago from '../config/mercadopago.js';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

const createPaymentPreference = async (req, res) => {
    const { product, quantity, totalPrice, guests } = req.body;

    if (typeof totalPrice !== 'number' || typeof quantity !== 'number') {
        return res.status(400).json({ error: 'totalPrice and quantity should be numbers' });
    }

    let unitPrice = Number((totalPrice / quantity).toFixed(2));

    if (unitPrice < 1) unitPrice = 1;

    const preference = {
        items: [
            {
                title: product.title,
                unit_price: unitPrice,
                quantity: quantity,
                currency_id: 'PEN',
            }
        ],
        back_urls: {
            success: "http://localhost:3000/success",
            failure: "http://localhost:3000/failed",
            pending: "http://localhost:3000/pending"
        },
        auto_return: "approved",
        notification_url: "http://localhost:3000/webhook"
    };

    try {
        const response = await mercadopago.preferences.create(preference);

        // Guarda la información de los invitados en la base de datos
        await Payment.create({ paymentId: response.body.id, guests });

        res.status(200).json({
            init_point: response.body.init_point,
            paymentId: response.body.id // devuelve el id de la preferencia de pago
        });

    } catch (error) {
        console.error("Error when creating MercadoPago preference:", error);
        if (error.response) {
            console.error('Error response', error.response.data);
            console.error('Error status', error.response.status);
            console.error('Error headers', error.response.headers);
        } else if (error.request) {
            console.error('Error request', error.request);
        } else {
            console.error('Error message', error.message);
        }
        res.status(500).json({ error: error.message });
    }
};

const webhook = async (req, res) => {
    const { type, data } = req.body;
    if (type === "payment" && data.status === "approved") {
        // Guarda la información de los invitados en tu tabla de reservas aquí
        // Puedes usar data.id para buscar la reserva correspondiente
        // y actualizarla con la información de los invitados y el estado de pago
        try {
            const updatedBooking = await Booking.findOneAndUpdate({ paymentId: data.id }, { paymentStatus: "approved" }, { new: true });
            if (!updatedBooking) {
                console.error(`No booking found with paymentId: ${data.id}`);
            }
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    }
    res.status(200).end();
};

export { createPaymentPreference, webhook };
