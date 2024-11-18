import express from "express"
import { createArticle, deleteArticle, dislikeArticle, genArticles, genrateSummary, getArticleById, getArticleByUserId, getLikeDislikeCount, likeArticle, newarticle, recentArticles, recommendArticles, trendArticles, updateArticle, viewsarticle } from "../controller/article_controller.js";

const router = express.Router();
router.post('/', createArticle);
router.get('/', genArticles);
router.get('/recent', recentArticles);
router.get('/trending', trendArticles);
router.put('/view/:id',viewsarticle)
router.get('/newarticle', newarticle);
router.get('/getbyuser/:id', getArticleByUserId);
router.get('/:articleId', getArticleById);
router.put('/:articleId', updateArticle);
router.delete('/:articleId',deleteArticle);
router.post('/generate-summary', genrateSummary);
router.get('/recommendations/:userId', recommendArticles);
router.post('/:articleId/like', likeArticle);
router.post('/:articleId/dislike', dislikeArticle);
router.get('/:articleId/likes-dislikes', getLikeDislikeCount);

export default router;