import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Contact name is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            trim: true,
        },
        notes: String,
        linkedIn: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
