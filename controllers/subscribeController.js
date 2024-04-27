import Subscriber from '../models/Subscribe.js';

export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({});
        return res.status(200).json(subscribers);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const subscribe = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo electrónico es obligatorio' });
    }

    try {
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            return res.status(400).json({ message: 'Este correo electrónico ya está suscrito' });
        }

        const subscriber = new Subscriber({ email });

        const newSubscriber = await subscriber.save();
        return res.status(201).json(newSubscriber);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

