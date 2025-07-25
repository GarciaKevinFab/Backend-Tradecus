import mongoose from "mongoose";

const UserMobileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    googleId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
}, { timestamps: true });

export default mongoose.model("UserMobile", UserMobileSchema);
