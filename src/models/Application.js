import mongoose from 'mongoose';

const InterviewSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Phone', 'Technical', 'Behavioral', 'Onsite', 'Other'],
        default: 'Phone',
    },
    date: {
        type: Date,
        required: true,
    },
    notes: String,
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
});

const ChecklistItemSchema = new mongoose.Schema({
    item: { type: String, required: true },
    done: { type: Boolean, default: false },
});

const ApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
            default: 'Saved',
        },
        salary: String,
        location: String,
        url: String,
        notes: String,
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        contacts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Contact',
            },
        ],
        interviews: [InterviewSchema],
        checklist: [ChecklistItemSchema],
    },
    { timestamps: true }
);

export default mongoose.models.Application ||
    mongoose.model('Application', ApplicationSchema);
