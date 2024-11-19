import { User } from "../models/user_model.js";
import { Article} from "../models/article_model.js";
import { trendArticles } from "./article_controller.js";



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
        if (savedArticles.length && followedUsers.length) {
            articles = await Article.find({
                $or: [
                    { _id: { $in: savedArticles.map((article) => article._id) } },
                    { author: { $in: followedUsers } },
                ],
            });
        } 
        else if (savedArticles.length) {
            articles = await Article.find({
                _id: { $in: savedArticles.map((article) => article._id) },
            });
        } 
        else if (followedUsers.length) {
            articles = await Article.find({
                author: { $in: followedUsers },
            });
        } 
        else {
            return  await  trendArticles(req, res);
        }
        const categoryFilteredArticles = savedArticles.length
        ? articles.filter((article) =>
              savedArticles.some(
                  (savedArticle) =>
                      savedArticle._id.toString() === article._id.toString() &&
                      savedArticle.category === article.category
              )
          )
        : articles;

    res.status(200).json(categoryFilteredArticles);
    } catch (error) {
        console.error('Error fetching filtered articles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}