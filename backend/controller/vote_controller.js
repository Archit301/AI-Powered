import { Article } from "../models/article_model.js";
import { UserVote } from "../models/vote_model.js";

const likeArticle = async (userId, articleId) => {
    try {
      // Check if the user has already liked the article
      const existingVote = await UserVote.findOne({ userId, articleId, voteType: "like" });
  
      if (existingVote) {
        return { message: "You have already liked this article." };
      }
  
      // If not, create a new vote entry for the user
      const newVote = new UserVote({
        userId,
        articleId,
        voteType: "like"
      });
      await newVote.save();
  
      // Increment the upvotes count for the article
      const article = await Article.findByIdAndUpdate(
        articleId, 
        { $inc: { upvotes: 1 } },  // Increment upvotes by 1
        { new: true } // Return the updated document
      );
  
      return article;  // The updated article document
    } catch (error) {
      console.error(error);
    }
  };