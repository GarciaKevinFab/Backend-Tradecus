import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {  // Assuming this should be 'userId' instead of 'usertId'
            type: String
        },
        userEmail: {
            type: String,
        },
        tourName: {
            type: String,
            required: true,
        },
        tourType: {  // New field for tour type
            type: String,
            required: true,
        },
        guestSize: {
            type: Number,
            required: true,
        },
        phone: {
            type: String,  // Changed to String to accommodate different phone number formats
            required: true,
        },
        bookAt: {
            type: Date,
            required: true,
        },
        userData: [{  // New field for guest details
            nombres: String,
            apellidoPaterno: String,
            apellidoMaterno: String,
            // Include any other fields that are part of the DNI data
        }]
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
