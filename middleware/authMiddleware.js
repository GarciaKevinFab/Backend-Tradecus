// authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware para Passport (autenticación por sesión, Google, etc.)
export function ensureAuthenticated(req, res, next) {
    // Si el usuario está autenticado por sesión (ej: Google OAuth)
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Usuario no autenticado. No autorizado.');
}

// Middleware para JWT (autenticación por token, normal de APIs)
export function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }
    // El típico "Bearer <token>"
    if (token.startsWith('Bearer ')) {
        token = token.slice(7); // Elimina "Bearer "
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        req.user = decoded; // El payload decodificado (id, role, etc)
        next();
    });
}
