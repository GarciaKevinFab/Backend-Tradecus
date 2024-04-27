import express from "express";
import ensureAuthenticated from "../middleware/authMiddleware.js"; // Asegúrate de que la ruta es correcta
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser, getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

// Rutas existentes
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id', getSingleUser);
router.get('/', getAllUser);

router.get('/me', ensureAuthenticated, getCurrentUser);


export default router;
