import express from 'express';
import { getCeeData } from '../controllers/ceeController.js';

const router = express.Router();
router.get('/getCeeData/:number', getCeeData);
export default router;
