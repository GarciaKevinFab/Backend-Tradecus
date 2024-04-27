import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Configurando estrategia de Passport para Google.');

passport.use(new GoogleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Este callbackURL debe coincidir con lo configurado en Google Cloud Platform y tu backend
    callbackURL: 'http://localhost:4000/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Ejecutando callback para Google Strategy. Perfil recibido:', profile);

    console.log('Ejecutando callback de estrategia de Google.');
    console.log(`Datos del perfil de Google recibidos: ${profile}`);
    try {
        console.log(`Buscando en la base de datos al usuario con Google ID: ${profile.id}`);
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            console.log('Usuario no encontrado con Google ID, buscando por email.');
            user = await User.findOne({ email: profile.emails[0].value });

            if (!user) {
                console.log('Email no encontrado, creando nuevo usuario.');
                user = await new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value
                }).save();
                console.log(`Nuevo usuario creado: ${user.username}`);
            } else {
                console.log('Email encontrado en la base de datos, actualizando Google ID.');
                user.googleId = profile.id;
                await user.save();
            }
        } else {
            console.log(`Usuario existente encontrado: ${user.username}`);
        }
        return done(null, user);
    } catch (err) {
        console.error(`Error al buscar/crear usuario: ${err}`);
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log(`Serializando usuario: ${user}`);
    // Guarda el ID del usuario en la sesión
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Deserializando usuario por ID: ${id}`);
    try {
        const user = await User.findById(id);
        console.log(`Usuario deserializado encontrado: ${user}`);
        done(null, user); // El usuario se adjunta al objeto req.user
    } catch (err) {
        console.error('Error durante la deserialización:', err);
        done(err);
    }
});

console.log('Estrategia de Passport para Google configurada.');