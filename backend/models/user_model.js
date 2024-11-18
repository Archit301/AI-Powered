import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username: {
        type:String,
        trim:true,
        unique:true,
        required:[true,"Username required"],
        minlength:[3,"Username must be at least 3 characters long"],
        maxlength:[30,"Username cannot be more than 30 characters long"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        // validate:[isEmail,"Please provide a valid email address"]
    },
    password:{
        type:String,
        required:true
    },
    avatar: {
        type: String, 
        default: 'defaultProfilePicUrl'
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    followingTopics: [{
        type: String, 
        enum: ['AI', 'Technology', 'Health', 'Business', 'Lifestyle', 'Others']
    }],
    followedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    savedArticles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article' 
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification' 
    }],
    dateJoined: {
        type: Date,
        default: Date.now
    }
})

export const User=mongoose.model("User",userSchema)