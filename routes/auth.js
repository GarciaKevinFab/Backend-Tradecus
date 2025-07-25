import express from 'express';
import passport from 'passport';

const router = express.Router();

// Inicia el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google redirige aquí después de la autenticación
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // El usuario está autenticado en este punto, entonces lo redirigimos al frontend
        console.log('Autenticación exitosa, redirigiendo al dashboard del frontend.');
        // Aquí es donde rediriges a tu frontend (asegúrate de que la URL sea correcta)
        res.redirect('http://localhost:3000/dashboard');
    }
);

export default router;
