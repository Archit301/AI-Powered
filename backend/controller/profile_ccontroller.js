import { User } from "../models/user_model.js";
import { Article} from "../models/article_model.js";
import { trendArticles } from "./article_controller.js";
import { Question } from "../models/question_model.js";



export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const articles = await Article.find({ author: user._id });
        res.status(200).json({ user, articles });
    } catch (error) {
        console.log("hello")
        res.status(500).json({ error: 'Failed to get profile' });
    }
};



export const savedArticle = async (req, res) => {
    try {
        const { articleId,userId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedArticles: articleId } }, 
            { new: true } 
          );
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
    
          return res.status(200).json({ message: 'Article saved successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
};


export const unsavedArticle = async (req, res) => {
    try {
        const { articleId,userId } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedArticles: articleId } }, 
            { new: true } 
          );
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
    
          return res.status(200).json({ message: 'Article unsaved successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
};


export const getsavedarticle=async(req,res)=>{
    try {
        const {userId } = req.params;
        const user = await User.findById(userId).populate('savedArticles'); // Optionally populate savedArticles
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
      } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ error: 'Failed to process request' });
      }
}



export const getsavedarticlebyid=async(req,res)=>{
    try {
        const {articleId,userId} = req.params;
        const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isSaved = user.savedArticles.includes(articleId);
    console.log(isSaved)
    return res.status(200).json({ saved: isSaved });
  } catch (error) {
    console.error('Error in getsavedarticlebyid:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}







export const getFilteredArticles = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const user = await User.findById(userId).populate('savedArticles');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { savedArticles, followedUsers } = user;
        let articles = [];

        // If both savedArticles and followedUsers have data, fetch articles from both
        if (savedArticles.length && followedUsers.length) {
            const savedArticlesData = await Article.find({
                _id: { $in: savedArticles.map((article) => article._id) }
            });

            const followedArticlesData = await Article.find({
                author: { $in: followedUsers }
            });

            // Merge both sets of articles
            articles = [...savedArticlesData, ...followedArticlesData];
        } 
        // If only savedArticles have data
        else if (savedArticles.length) {
            articles = await Article.find({
                _id: { $in: savedArticles.map((article) => article._id) }
            });
        } 
        // If only followedUsers have data
        else if (followedUsers.length) {
            articles = await Article.find({
                author: { $in: followedUsers }
            });
        } 
        // If both are empty, fetch trending articles
        else {
            return await trendArticles(req, res);
        }

        // Optional: Remove duplicates if any (in case some articles are in both savedArticles and followedUsers)
        const uniqueArticles = [...new Set(articles.map(a => a._id.toString()))].map(id =>
            articles.find(article => article._id.toString() === id)
        );

        // If savedArticles exist, filter by category as well
        const categoryFilteredArticles = savedArticles.length
            ? uniqueArticles.filter((article) =>
                  savedArticles.some(
                      (savedArticle) =>
                          savedArticle._id.toString() === article._id.toString() &&
                          savedArticle.category === article.category
                  )
              )
            : uniqueArticles;

        res.status(200).json(categoryFilteredArticles);
    } catch (error) {
        console.error('Error fetching filtered articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const topics=async(req,res)=>{
 try {
    const {topics}=req.params
    const article=await Article.find({category:topics})
     const question=await Question.find({category:topics})
  if(!article&&!question){
    return res.status(200).json("No data found")
  }
  res.status(200).json*({article,question})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    
 }
}