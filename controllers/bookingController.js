import Booking from '../models/Booking.js';

//create new booking
export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();

        res.status(200).json({ success: true, message: 'Your tour is booked', data: savedBooking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'internal server error' }); // Cambie el valor de success a false
    }
};

//get single booking
export const getBooking = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Booking.findById(id);

        res.status(200).json({ success: true, message: 'successful', data: book });
    } catch (err) {
        res.status(404).json({ success: false, message: 'not found' }); // Cambie el valor de success a false
    }
};

//get all booking
export const getAllBooking = async (req, res) => {

    try {
        const books = await Booking.find();

        res.status(200).json({ success: true, message: 'successful', data: books });
    } catch (err) {
        res.status(500).json({ success: false, message: 'internal server error' });
    }
};

//recien agregado
export const getBookingCount = async (req, res) => {
    try {
        const count = await Booking.countDocuments({ tourId: req.params.tourId });
        res.json(count);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }


};

// Update existing booking
export const updateBooking = async (req, res) => {
    const id = req.params.id;

    try {
        // Encuentra la reserva por ID y actualízala con los nuevos datos
        // { new: true } devuelve el documento actualizado
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, { new: true });

        if (updatedBooking) {
            res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
        } else {
            // Si no se encuentra la reserva, devuelve un error 404
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};

// Agrega esta nueva función para eliminar una reserva
export const deleteBooking = async (req, res) => {
    const id = req.params.id; // Obtén el ID de la reserva desde los parámetros de la ruta

    try {
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (deletedBooking) {
            res.status(200).json({ success: true, message: 'Booking deleted successfully' });
        } else {
            // Si no se encuentra la reserva, devuelve un error 404
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};

export const getUserBookingCount = async (req, res) => {
    const userId = req.params.userId;

    try {
        const count = await Booking.countDocuments({ userId });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMonthlyBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: "$bookAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMonthlyIncomeStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: { $month: "$bookAt" },
                    total: { $sum: "$price" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ingresos por QUINCENA
export const getFortnightIncomeStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$bookAt" },
                        month: { $month: "$bookAt" },
                        fortnight: {
                            $cond: [
                                { $lte: [{ $dayOfMonth: "$bookAt" }, 15] },
                                1,
                                2
                            ]
                        }
                    },
                    total: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.fortnight": 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ingresos por DÍA
export const getDailyIncomeStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$bookAt" },
                        month: { $month: "$bookAt" },
                        day: { $dayOfMonth: "$bookAt" }
                    },
                    total: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Trae TODAS las reservas de un usuario específico
export const getUserBookings = async (req, res) => {
    const userId = req.params.userId;
    try {
        const bookings = await Booking.find({ userId });
        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// RESERVAS POR QUINCENA
export const getFortnightBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$bookAt" },
                        month: { $month: "$bookAt" },
                        fortnight: {
                            $cond: [
                                { $lte: [{ $dayOfMonth: "$bookAt" }, 15] },
                                1,
                                2
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.fortnight": 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// RESERVAS POR DÍA
export const getDailyBookingStats = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$bookAt" },
                        month: { $month: "$bookAt" },
                        day: { $dayOfMonth: "$bookAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
        res.status(200).json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
