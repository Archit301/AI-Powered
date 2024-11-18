import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
    totalArticles: {
        type: Number,
        default: 0
    },
    totalComments: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    activeUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    popularTopics: [{
        type: String,
        enum: ['AI', 'Technology', 'Health', 'Business', 'Lifestyle', 'Others']
    }],
    totalReports: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Stats = mongoose.model('Stats', statsSchema)