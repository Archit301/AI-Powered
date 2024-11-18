import { Comment } from "../models/comment_model.js";

export const addComment=async(req,res)=>{
    try {
        const { content, author, articleId, } = req.body;
        const comment = new Comment({ content, author, article: articleId });
        await comment.save();
        console.log(comment)
        res.status(201).json({ message: 'Comment added' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    } 
}


export const getCommentsByArticle = async (req, res) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId }).populate('author');
    //    console.log("hello1")  
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};
