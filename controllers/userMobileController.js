import User from '../models/UserMobile.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from "crypto";
import bcrypt from 'bcryptjs';

//create new User
export const createUser = async (req, res) => {
    const newUser = new User(req.body);

    try {
        const savedUser = await newUser.save();

        res
            .status(200)
            .json({
                success: true,
                message: 'Successfully created',
                data: savedUser,
            });
    } catch (err) {
        if (err.code === 11000) {
            // This is a duplicate key error
            res
                .status(400)
                .json({ success: false, message: 'Username or email already exists.' });
        } else {
            res
                .status(500)
                .json({ success: false, message: 'Failed to create. Try again.' });
        }
    }
};


//update User
export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, {
            $set: req.body,
        },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully updated',
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to updated',
        });
    }
};

//delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Successfully deleted',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to deleted',
        });
    }
};

//getSingle User
export const getSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);

        res.status(200).json({
            success: true,
            message: 'Successful',
            data: user,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'not found',
        });
    }
};

//getAll User
export const getAllUser = async (req, res) => {

    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            message: 'Successful',
            data: users,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: 'not found',
        });
    }
};

// Get current user
export const getCurrentUser = async (req, res) => {
    console.log("Obteniendo el usuario actual...");
    try {
        const user = await User.findById(req.user._id);
        console.log("Usuario encontrado:", user);
        res.status(200).json(user);
    } catch (err) {
        console.log("Error al obtener el usuario:", err);
        res.status(500).json({ message: 'Error retrieving user data' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send("Token inválido o expirado.");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        // 🔁 Redirige a la ruta del frontend
        res.redirect('https://tradecus.netlify.app/email-verified');
    } catch (error) {
        console.error("Error verificando el correo:", error);
        res.status(500).send("Error del servidor.");
    }
};

export const resendVerificationEmail = async (req, res) => {
    console.log('Usuario autenticado:', req.user);

    try {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        if (user.isVerified) return res.status(400).json({ message: "Ya estás verificado" });

        const token = crypto.randomBytes(32).toString("hex");
        user.verificationToken = token;
        user.verificationTokenExpires = Date.now() + 3600000;
        await user.save();

        const verifyUrl = `${process.env.BASE_URL}/${token}`;
        const html = `
<div style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #1e90ff; text-align: center;">🌍 Tradecus Tours</h2>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    
    <p style="font-size: 16px; color: #333;">Hola <strong>${user.fullName || user.username || 'usuario'}</strong>,</p>
    
    <p style="font-size: 16px; color: #333;">
      ¡Gracias por registrarte en <strong>Tradecus</strong>! Solo queda un paso más para comenzar a explorar y reservar experiencias increíbles.
    </p>

    <p style="font-size: 16px; color: #333;">
      Haz clic en el botón de abajo para verificar tu correo electrónico:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" 
         style="background-color: #1e90ff; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
         Verificar correo
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">
      Si no te registraste en Tradecus, puedes ignorar este mensaje. Este enlace expirará en 1 hora por motivos de seguridad.
    </p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 13px; color: #999; text-align: center;">
      Tradecus Tours &copy; ${new Date().getFullYear()}<br>
      Explora. Reserva. Descubre el mundo con nosotros.
    </p>
  </div>
</div>
`;

        await sendEmail(user.email, "Verifica tu correo", html);
        res.status(200).json({ message: "Correo reenviado" });
    } catch (err) {
        res.status(500).json({ message: "Error al reenviar correo" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar contraseña' });
    }
};