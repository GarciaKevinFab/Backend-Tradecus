import express from 'express';
import { subscribe, getSubscribers } from '../controllers/subscribeController.js';

const router = express.Router();

// Route for creating a new subscriber
router.post('/', subscribe);

// Route for getting all subscribers
router.get('/', getSubscribers);

export default router;
