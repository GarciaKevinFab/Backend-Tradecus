import UserMobile from '../models/UserMobile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

//user registration
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

        const newUser = new UserMobile({
            username,
            email,
            password: hash,
            photo,
            googleId: googleId || generateGoogleId()  // Utiliza generateGoogleId si googleId no está presente
        });

        await newUser.save();
        res.status(200).json({ success: true, message: 'Successfully created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create. Try again' });
    }
};

// Función para generar un googleId único
const generateGoogleId = () => {
    return 'googleId' + Math.floor(Math.random() * 1000);
};


//user login
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
        res.status(500).json({ success: false, message: 'Faild to login' });
    }
};
