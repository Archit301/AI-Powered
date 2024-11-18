import mongoose from "mongoose";

const userVoteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  articleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Article', 
    required: true 
  },
  voteType: {  // "like" or "dislike"
    type: String,
    enum: ["like", "dislike"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const UserVote = mongoose.model("UserVote", userVoteSchema);
