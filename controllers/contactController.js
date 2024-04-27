import ContactMessage from '../models/Contact.js';

export const getContactMessages = async (req, res) => {
    try {
        const contactMessages = await ContactMessage.find({});
        return res.status(200).json(contactMessages);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const deleteContactMessage = async (req, res) => {
    const { id } = req.params;

    try {
        await ContactMessage.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Contact message deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    // Crear y guardar el mensaje en la base de datos
    const newMessage = new ContactMessage({
        name,
        email,
        message,
    });

    try {
        await newMessage.save();
        return res.status(200).json({ message: 'Mensaje recibido con éxito' });
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un error al procesar tu mensaje' });
    }
};

export const getContactMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const contactMessage = await ContactMessage.findById(id);

        if (!contactMessage) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        return res.status(200).json(contactMessage);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
