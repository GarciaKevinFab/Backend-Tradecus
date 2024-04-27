import express from 'express';
import { createPaymentPreference, webhook } from '../controllers/mercadopagoController.js';

const router = express.Router();

router.post('/create_payment', createPaymentPreference);
router.post('/webhook', webhook);

export default router;
