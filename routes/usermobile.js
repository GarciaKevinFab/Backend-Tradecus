import express from 'express';
import { login, register } from '../controllers/authController.js';
import {
    createUser,
    updateUser,
    deleteUser,
    getSingleUser,
    getAllUser,
    getCurrentUser
} from '../controllers/userMobileController.js';

const router = express.Router();
//login contraseña y correo
router.post('/register', register);
router.post('/login', login);

router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getSingleUser);
router.get('/', getAllUser);

router.get('/me', getCurrentUser);

export default router;