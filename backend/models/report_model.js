import mongoose from "mongoose";


const reportSchema = new mongoose.Schema({
    contentType: {
        type: String,
        enum: ['article', 'comment', 'answer'],
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Report = mongoose.model('Report', reportSchema);