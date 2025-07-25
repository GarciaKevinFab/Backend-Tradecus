import express from 'express';
import { login, register } from '../controllers/authController.js';
import {
    createUser,
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUser,
    getCurrentUser,
    verifyEmail,
    resendVerificationEmail,
    changePassword
} from '../controllers/userMobileController.js';
import ensureAuthenticated from '../middleware/authMiddlewares.js';

const router = express.Router();

// 🔐 Registro y Login
router.post('/register', register);
router.post('/login', login);

// 🔐 Rutas que deben ir antes de las dinámicas
router.get('/me', ensureAuthenticated, getCurrentUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', ensureAuthenticated, resendVerificationEmail);

// 👤 CRUD de usuario
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getSingleUser);
router.get('/', getAllUser);
router.post('/change-password', ensureAuthenticated, changePassword);

export default router;
