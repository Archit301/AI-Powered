import express from "express"
import { addComment, getCommentsByArticle } from "../controller/comment_controller.js";

const router=express.Router();
router.post('/',addComment);
router.get('/article/:articleId',getCommentsByArticle);
export default router