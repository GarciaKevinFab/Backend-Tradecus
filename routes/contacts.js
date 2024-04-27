import express from 'express';
import { sendMessage , getContactMessages , deleteContactMessage, getContactMessage } from '../controllers/contactController.js';

const router = express.Router();

// Route for getting all contact messages
router.get('/', getContactMessages);

// Route for deleting a contact message
router.delete('/:id', deleteContactMessage);

// Route for sending a contact message
router.post('/', sendMessage);

router.get('/:id', getContactMessage);

export default router;
