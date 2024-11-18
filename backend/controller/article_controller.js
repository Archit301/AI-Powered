import { Article } from "../models/article_model.js";
import mongoose from "mongoose";
import { Recommendation } from "../models/recommendation_model.js";
import openai from "openai"

export const createArticle=async(req,res)=>{
    const { title, content, author, tags, category, summary, images } = req.body;
    // console.log('Request received:', req.body);
    
    const article = new Article({ title, content, author, tags, category, images, summary });
    // console.log('Article object created:', article);
    
    try {
        await article.save();
        // console.log("Article saved successfully");
        res.status(201).json({ message: 'Article created successfully' });
    } catch (error) {
        console.error("Error during article creation:", error);
        res.status(500).json({ error: 'Failed to create article' });
    }
}


export const genArticles=async(req,res)=>{
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    } 
}

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.articleId).populate('author');
        // console.log("hello")
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};

export const getArticleByUserId=async(req,res)=>{
    try {
        const article = await Article.find({author:req.params.id}).populate('author');
        // console.log("hello")
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
}


export const genrateSummary=async(req,res)=>{
    try {
        const { content } = req.body;
        const summary = await openai.generateSummary(content);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate summary' });
    }
}

export const recommendArticles=async(req,res)=>{
    try {
        const userId = req.params.userId;
        const recommendations = await Recommendation.findOne({ user: userId }).populate('recommendedArticles');
        res.json(recommendations.recommendedArticles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
}

export const updateArticle = async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;
        const article = await Article.findByIdAndUpdate(
            req.params.articleId,
            { title, content, tags, category },
            { new: true }
        );
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
};

// Delete article
export const deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.articleId);
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
};

export const newarticle=async(req,res)=>{
    try {
        const articles = await Article.find().populate('author')
  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
  .limit(5); // Limit the results to 5
//   console.log("hello")
res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    } 
}

export const viewsarticle=async(req,res)=>{
    try {
        const articleId = req.params.id;
        const updatedArticle = await Article.findByIdAndUpdate(
          articleId,
          { $inc: { views: 1 } },
          { new: true } 
        );   
        if (!updatedArticle) {
          return res.status(404).json({ message: 'Article not found' });
        }   
        res.status(200).json(updatedArticle);
      } catch (error) {
        res.status(500).json({ message: 'Error updating views', error });
      }
}



export const likeArticle = async (req, res) => {
  const { userId } = req.body; 
  const { articleId } = req.params; 

  try {
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Convert userId to ObjectId if not already
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (article.likedBy.includes(userObjectId)) {
      return res.status(400).json({ message: "You have already liked this article" });
    }

    // Remove from dislikedBy if present
    if (article.dislikedBy.includes(userObjectId)) {
      article.dislikedBy = article.dislikedBy.filter(
        (id) => id.toString() !== userObjectId.toString()
      );
      article.dislikes -= 1;
    }

    // Add to likedBy and increment upvotes
    article.likedBy.push(userObjectId);
    article.upvotes += 1;

    // Save changes
    await article.save();

    return res.status(200).json({
      message: "Article liked successfully",
      article,
    });
  } catch (error) {
    console.error("Error liking the article:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
  
export const dislikeArticle = async (req, res) => {
  const {userId} = req.body; 
  const { articleId } = req.params;

  try {
    // Find the article
    const article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if the user has already disliked the article
    if (article.dislikedBy.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(400).json({ message: 'You have already disliked this article' });
    }

    // Remove user from likedBy array if they previously liked the article
    if (article.likedBy.includes(new mongoose.Types.ObjectId(userId))) {
      article.likedBy.pull(new mongoose.Types.ObjectId(userId));
      article.upvotes -= 1; // Decrease the upvotes count
    }

    // Add user to dislikedBy array and increment downvotes
    article.dislikedBy.push(new mongoose.Types.ObjectId(userId));
    article.dislikes += 1;

    // Save the article with updated like and dislike data
    await article.save();

    return res.status(200).json({ message: 'Article disliked successfully', article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



  export const getLikeDislikeCount = async (req, res) => {
    const { articleId } = req.params;
  
    // Validate articleId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ message: "Invalid article ID" });
    }
  
    try {
      const article = await Article.findById(articleId)
  .populate('likedBy', '_id')  // Populating likedBy to get user details
  .populate('dislikedBy', '_id');
  
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
  
      const likeCount = article.likedBy.length;
      const dislikeCount = article.dislikedBy.length;
      const likedId=article.likedBy
      const dislikeId = article.dislikedBy;
  
      return res.status(200).json({
        message: "Like and Dislike count fetched successfully",
        likeCount,
        dislikeCount,
        likedId,
        dislikeId
      });
    } catch (error) {
      console.error("Error fetching like/dislike count:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  




  export const trendArticles = async (req, res) => {
    try {
      const minViews = 10; 
    const minLikes = 2;  

   
    const articles = await Article.find({
      views: { $gte: minViews },  
      // likes: { $gte: minLikes },  
    }).sort({ views: -1, likes: -1 });  

    // Return the filtered and sorted articles
    res.json(articles);
 
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  };
















  export const recentArticles = async (req, res) => {
    try {
      // Get today's date and set the start of the day (00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // Set time to the start of the day
  
      // Get the next day (23:59:59) for comparison
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + 1);  // Increment the date by 1 for next day
  
      // Query to find articles that were added today
      const articles = await Article.find({
        createdAt: { $gte: today, $lt: nextDay }, // Filter articles for today
      }).sort({ createdAt: -1 }); // Sort by creation date in descending order (most recent first)
  
      // If no articles were found today, fetch articles from the next day
      if (articles.length === 0) {
        const articlesFromNextDay = await Article.find({
          createdAt: { $gte: nextDay, $lt: new Date(nextDay).setDate(nextDay.getDate() + 1) },
        }).sort({ createdAt: -1 }); // Sort by creation date for the next day
        return res.json(articlesFromNextDay); // Return articles from the next day
      }
  
      // If articles are found for today, return them
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  };