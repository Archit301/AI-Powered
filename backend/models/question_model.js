import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['AI', 'Technology', 'Health', 'Business', 'Lifestyle', 'Others'],
        required: true
    },
    tags: [{
        type: String
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Question=mongoose.model("Question",questionSchema)