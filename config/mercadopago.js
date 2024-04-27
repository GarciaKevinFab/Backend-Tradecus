import dotenv from 'dotenv';
import mercadopago from 'mercadopago';

dotenv.config();
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
});

export default mercadopago;
