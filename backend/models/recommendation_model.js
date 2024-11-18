import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recommendedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    recommendedQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
