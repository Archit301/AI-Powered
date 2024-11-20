import express from "express"
import { getAdminArticleStats,getAdminCommentCount,getAdminFollowers, getFilteredArticles, getFilteredArticlesMonthlyLikeDislike, getFilteredArticlesMonthlyView, getPopularContent, getsavedarticle, getsavedarticlebyid, getUserProfile, savedArticle, topics, unsavedArticle } from "../controller/profile_ccontroller.js";

const router=express.Router()

router.get('/:userId/profile', getUserProfile);
router.get('/:articleId/:userId/savedarticlebyid', getsavedarticlebyid);
router.get('/:userId/saved-articles', getsavedarticle);
router.get('/:userId/totalfollowers', getAdminFollowers);
router.get('/:userId/stats', getAdminArticleStats);
router.get('/:userId/popular', getPopularContent);
router.get('/:userId/totalcomment', getAdminCommentCount);
router.put('/savearticle', savedArticle);
router.put('/unsavearticle', unsavedArticle);
router.get('/:userId/recommend',getFilteredArticles );
router.get("/:topics/category",topics)
router.get("/filtered-views/:year/:month/:author",getFilteredArticlesMonthlyView)
router.get("/filtered-likes/:year/:month/:author",getFilteredArticlesMonthlyLikeDislike)
export default router