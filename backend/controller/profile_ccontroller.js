import { User } from "../models/user_model.js";
import { Article} from "../models/article_model.js";
import { trendArticles } from "./article_controller.js";
import { Question } from "../models/question_model.js";
import mongoose from "mongoose";
import { Comment } from "../models/comment_model.js";



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
  else if(article&&!question){
    return    res.status(200).json(article)
  }
  else if(!article&&question){
  return  res.status(200).json(question) 
  }
  res.status(200).json({article,question})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    
 }
}


export const getAdminFollowers = async (req, res) => {
    try {
        const { userId } = req.params;  
        if (!userId) {
            return res.status(400).json({ error: 'Admin ID is required.' });
          }
          const totalFollowers = await User.countDocuments({
            followedUsers: userId
          });
      
          return res.status(200).json({ totalFollowers });
    } catch (error) {
        console.error('Error fetching admin followers:', error);
        res.status(500).json({ error: 'Internal server error.' });  
    }
}



export const getAdminArticleStats = async (req, res) => {
    try {
        const { userId } = req.params; 
        // console.log(userId)
        if (!userId) {
            return res.status(400).json({ error: 'Admin ID is required.' });
          }
          const adminId =new mongoose.Types.ObjectId(userId);
          const stats = await Article.aggregate([
            {
                $match: { author: adminId } // Match articles by admin ID
            },
            {
                $project: {
                    totalLikes: { $size: { $ifNull: ["$likedBy", []] } },
                    totalDislikes: { $size: { $ifNull: ["$dislikedBy", []] } },
                    totalViews: { $ifNull: ["$views", 0] }
                }
            },
            {
                $group: {
                    _id: null, // We are grouping all articles together
                    totalLikes: { $sum: "$totalLikes" },
                    totalDislikes: { $sum: "$totalDislikes" },
                    totalViews: { $sum: "$totalViews" }
                }
            }
        ]);
          if (stats.length === 0) {
            return res.status(200).json({
              totalLikes: 0,
              totalDislikes: 0,
              totalViews: 0
            });
          }
          return res.status(200).json(stats[0]);
        } catch (error) {
          console.error('Error fetching article stats:', error);
          res.status(500).json({ error: 'Internal server error.' });
        }
}

export const getAdminCommentCount = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'Admin ID is required.' });
          }
          const adminArticles = await Article.find({ author: userId }).select('_id');
          if (!adminArticles || adminArticles.length === 0) {
            return res.status(200).json({ totalComments: 0 });
          }
          const articleIds = adminArticles.map(article => article._id);
          const totalComments = await Comment.countDocuments({
            article: { $in: articleIds }
          });
      
          return res.status(200).json({ totalComments });
        } catch (error) {
          console.error('Error fetching admin comment count:', error);
          res.status(500).json({ error: 'Internal server error.' });
        }
}









export const getPopularContent = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        const popularArticle = await Article.aggregate([
            { $match: { author: new mongoose.Types.ObjectId(userId) } }, // Match articles by user
            { $sort: { views: -1 } }, // Sort articles by views in descending order
            { $limit: 1 }, // Get only the top article
            {
                $project: {
                    title: 1,
                    views: 1,
                    images:1,
                    summary: 1,
                    createdAt: 1,
                }
            }
        ]);

        const popularQuestion = await Question.aggregate([
            { $match: { author:new  mongoose.Types.ObjectId(userId) } }, // Match questions by user
            { $sort: { views: -1 } }, // Sort questions by views in descending order
            { $limit: 1 }, // Get only the top question
            {
                $project: {
                    title: 1,
                    views: 1,
                    questiontext: 1,
                    createdAt: 1,
                    // You can project other fields you need
                }
            }
        ]);

        // If no articles or questions found, return a suitable response
        if (popularArticle.length === 0) {
            return res.status(404).json({ message: 'No articles found for this user.' });
        }

        if (popularQuestion.length === 0) {
            return res.status(404).json({ message: 'No questions found for this user.' });
        }

        // Return the most popular article and question
        return res.status(200).json({
            popularArticle: popularArticle[0],  // the top article
            popularQuestion: popularQuestion[0], // the top question
        });

    } catch (error) {
        console.error('Error fetching popular content:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};



export const getFilteredArticlesMonthlyView=async(req,res)=>{
    try {
        const { year, month, author } = req.params;
        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }
        const monthMap = {
            Jan: '01',
            Feb: '02',
            Mar: '03',
            Apr: '04',
            May: '05',
            Jun: '06',
            Jul: '07',
            Aug: '08',
            Sep: '09',
            Oct: '10',
            Nov: '11',
            Dec: '12'
        };
        const monthNum = monthMap[month];
        if (!monthNum) {
            return res.status(400).json({ message: 'Invalid month format. Use short month names like Jan, Feb, etc.' });
        }
        const monthString = `${year}-${monthNum}`; 
        const query = {
            "monthlyViews.month": monthString
        };
        if (author) {
            query.author = author; // Filter by author if provided
        }
        const articles = await Article.find(query, { title: 1, monthlyViews: 1, author: 1 });

        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: 'No articles found for the specified filters' });
        }
        const result = articles.map(article => ({
            articleId: article._id,
            title: article.title,
            author: article.author,
            monthlyViews: article.monthlyViews.filter(view => view.month === monthString)
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving filtered monthly views', error });
    }
}



export const getFilteredArticlesMonthlyLikeDislike = async (req, res) => {
    try {
        const { year, month, author } = req.params;
        
        // Check if year and month are provided
        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }

        // Map month names to numbers
        const monthMap = {
            Jan: '01',
            Feb: '02',
            Mar: '03',
            Apr: '04',
            May: '05',
            Jun: '06',
            Jul: '07',
            Aug: '08',
            Sep: '09',
            Oct: '10',
            Nov: '11',
            Dec: '12'
        };

        const monthNum = monthMap[month];
        if (!monthNum) {
            return res.status(400).json({ message: 'Invalid month format. Use short month names like Jan, Feb, etc.' });
        }

        const monthString = `${year}-${monthNum}`; 
        const query = {
            $or: [
                { "monthlyLikes.month": monthString },
                { "monthlyDislikes.month": monthString }
            ]
        };

        // Filter by author if provided
        if (author) {
            query.author = author;
        }

        // Fetch articles matching the query
        const articles = await Article.find(query, { title: 1, monthlyLikes: 1, monthlyDislikes: 1, author: 1 });

        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: 'No articles found for the specified filters' });
        }

        // Map the results to include both likes and dislikes data
        const result = articles.map(article => {
            // Find monthly data for likes and dislikes
            const likesData = article.monthlyLikes.filter(view => view.month === monthString);
            const dislikesData = article.monthlyDislikes.filter(view => view.month === monthString);

            return {
                articleId: article._id,
                title: article.title,
                author: article.author,
                monthlyData: {
                    likes: likesData,
                    dislikes: dislikesData
                }
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving filtered monthly likes and dislikes', error });
    }
};



export const TotalArticleandQuestion=async(req,res)=>{
    try {
        const {userId}=req.params;
        const article=await Article.countDocuments({author:userId})
        const question=await Question.countDocuments({author:userId})
        if(!article && !question){
            return res.status(200).json("No article and question found")
        }
        else if(article &&!question){
        return res.status(200).json(article)  
        }
        else if(!article && question){
            return res.status(200).json(question)  
            }
        res.status(200).json({question,article}) 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });  
    }
}