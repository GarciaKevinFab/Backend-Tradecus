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
            success: "https://tradecus.netlify.app/thank-you",
            failure: "https://tradecus.netlify.app/failed",
            pending: "https://tradecus.netlify.app/pending"
        },
        auto_return: "approved",
        notification_url: "https://backend-tradecus.onrender.com/api/v1/mercadopago/webhook"
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

    if (type === "payment") {
        try {
            const payment = await mercadopago.payment.findById(data.id);
            const paymentData = payment.body;

            console.log("✅ Webhook recibido:", paymentData);

            // Actualiza el estado del pago en tu modelo Payment
            await Payment.findOneAndUpdate(
                { paymentId: paymentData.id.toString() },
                {
                    paymentStatus: paymentData.status,
                    payerEmail: paymentData.payer?.email || "No disponible",
                },
                { new: true }
            );

            // Actualiza la reserva asociada (si ya la tienes guardada)
            await Booking.findOneAndUpdate(
                { paymentId: paymentData.id.toString() },
                { paymentStatus: paymentData.status },
                { new: true }
            );

        } catch (error) {
            console.error("❌ Error procesando el webhook:", error.message);
        }
    }

    res.status(200).end(); // responde siempre OK a MP
};


export { createPaymentPreference, webhook };
