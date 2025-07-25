// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  reviewText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema); // ← aquí está el fix
