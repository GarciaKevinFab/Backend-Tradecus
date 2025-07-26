import jwt from 'jsonwebtoken';
import UserMobile from '../models/UserMobile.js';

const ensureAuthenticated = async (req, res, next) => {
    try {
        // 1. Busca primero en headers (Bearer) y si no, en cookies
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, autorización denegada' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserMobile.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};

export default ensureAuthenticated;
