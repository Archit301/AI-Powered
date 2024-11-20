import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    summary: {
        type: String, // AI-generated summary
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['AI', 'Technology', 'Health', 'Business', 'Lifestyle', 'Others'],
        required: true
    },
    images: [{
        type: String 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0  
    },
    likedBy: [{  
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    dislikes: {
        type: Number,
        default: 0  
    },
    dislikedBy: [{  
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    monthlyViews: [{
        month: {
            type: String, // Format: 'YYYY-MM'
            required: true
        },
        count: {
            type: Number,
            default: 0
        }}],
   monthlyLikes: [{
         month: {
         type: String, // Format: 'YYYY-MM'
        required: true
         },
         count: {
         type: Number,
         default: 0
            }
        }],
    monthlyDislikes: [{
            month: {
                type: String, // Format: 'YYYY-MM'
                required: true
            },
            count: {
                type: Number,
                default: 0
            }
        }]
})

export const Article=mongoose.model("Article",articleSchema)