import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Inicia el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google redirige aquí después de la autenticación
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Asegúrate que req.user tenga el usuario ya creado o buscado por Passport
        const user = req.user;
        // Genera un JWT igual que tu login normal
        const token = jwt.sign(
            { id: user._id, role: user.role }, // lo que quieras poner en el payload
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );
        // Redirige con el token como query param
        res.redirect(`https://admin-tradecus.netlify.app/dashboard?token=${token}`);
    }
);
export default router;
