import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

export const createReview = async (req, res) => {
    try {
        const { reviewText, rating } = req.body;
        const tourId = req.params.tourId;
        const userId = req.user._id; // ✅ Traer el ID del usuario autenticado

        const newReview = new Review({
            tourId,
            userId,            // ✅ Asignar el userId
            username: req.user.username, // O lo puedes recibir por body, pero mejor desde auth
            reviewText,
            rating
        });

        await newReview.save();

        res.status(200).json({ success: true, message: 'Review creada correctamente', data: newReview });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error al crear la review', error: err.message });
    }
};

export const deleteReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    try {
        const deletedReview = await Review.findByIdAndRemove(reviewId);
        if (!deletedReview) {
            res.status(404).json({ success: false, message: 'Review not found' });
        } else {
            // Remove review reference from tour
            const tourId = deletedReview.tourId;
            await Tour.findByIdAndUpdate(tourId, {
                $pull: { reviews: reviewId },
            });
            res.status(200).json({ success: true, message: 'Review deleted', data: deletedReview });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
};

export const getReviewsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const reviews = await Review.find({ userId });
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

export const getReviewStats = async (req, res) => {
    try {
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: "$rating",
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