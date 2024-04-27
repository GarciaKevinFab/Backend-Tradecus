import express from 'express';
import { getDniData } from '../controllers/dniController.js'; 

const router = express.Router();

router.get('/getDniData/:dni', getDniData);

export default router;
