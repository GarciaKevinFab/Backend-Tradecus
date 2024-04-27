import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';

// Importar configuración de Passport
import './config/passport-setup.js';

// Rutas
import mercadopagoRoute from './routes/mercadopago.js';
import tourRoute from './routes/tours.js';
import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import reviewRoute from './routes/reviews.js';
import bookingRoute from './routes/bookings.js';
import dniRoutes from './routes/dni.js';
import subscribeRoute from './routes/subscribes.js';
import contactRoutes from './routes/contacts.js';
import paymentRoutes from './routes/paymentRoutes.js';
import UserMobileRoutes from './routes/usermobile.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuración CORS
const corsOptions = {
    origin: process.env.FRONTEND_URI,
    credentials: true
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Configuración de la tienda de sesiones
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, // Considera usar true si quieres que las sesiones se guarden automáticamente
    store: sessionStore,
    cookie: {
        secure: false, // Solo para desarrollo, debe ser true en producción con HTTPS
        httpOnly: true,
        sameSite: 'lax', // Cambiado de 'None' a 'lax' para entornos sin HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use((req, res, next) => {
    console.log('---------- INFORMACIÓN DE SESIÓN ----------');
    console.log('ID de Sesión:', req.sessionID);
    console.log('Datos de la Sesión:', req.session);
    console.log('Usuario de la Sesión:', req.user ? req.user.username : 'Ninguno');
    console.log('------------------------------------------');
    next();
});

// Inicializar Passport y sesiones de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('Sesión:', req.session);
    console.log('Usuario:', req.user);
    next();
});

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB database connected'))
    .catch(err => console.log('MongoDB database connection failed', err));

// Rutas
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/dni', dniRoutes);
app.use('/api/v1/subscribe', subscribeRoute);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/mercadopago', mercadopagoRoute);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/usermobile', UserMobileRoutes);


// Servir archivos estáticos para las imágenes subidas
app.use('/uploads', express.static('uploads'));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
