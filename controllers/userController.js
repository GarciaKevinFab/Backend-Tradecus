import User from '../models/User.js';

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

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al cambiar la contraseña' });
    }
};
