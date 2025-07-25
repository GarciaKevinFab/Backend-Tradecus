import UserMobile from '../models/UserMobile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import sendEmail from '../utils/sendEmail.js';

// Función para generar un googleId único
const generateGoogleId = () => {
    return 'googleId' + Math.floor(Math.random() * 1000);
};

// user registration
export const register = async (req, res) => {
    const { username, email, password, photo, googleId } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const existingUser = await UserMobile.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 3600000;

        const newUser = new UserMobile({
            username,
            email,
            password: hash,
            photo,
            googleId: googleId || generateGoogleId(),
            verificationToken,
            verificationTokenExpires,
            isVerified: false,
        });

        await newUser.save();

        const verifyLink = `${process.env.BASE_URL}/api/v1/users/verify-email/${verificationToken}`;
        const html = `
            <h2>Verifica tu cuenta</h2>
            <p>Haz clic en este enlace para verificar tu correo:</p>
            <a href="${verifyLink}">${verifyLink}</a>
        `;

        try {
            await sendEmail(newUser.email, "Verifica tu correo", html);
        } catch (err) {
            console.error("❌ Error enviando correo:", err);
            return res.status(500).json({ message: "Error al enviar correo" });
        }

        res.status(200).json({ success: true, message: 'Usuario creado. Verifica tu correo electrónico.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Fallo al crear el usuario.' });
    }
};

// user login
export const login = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserMobile.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);

        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        const { password, role, ...rest } = user._doc;

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: token.expiresIn
        }).status(200).json({ token, data: { ...rest }, role });

    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
};
