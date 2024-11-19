import express from "express"
import { getFilteredArticles, getsavedarticle, getsavedarticlebyid, getUserProfile, savedArticle, unsavedArticle } from "../controller/profile_ccontroller.js";

const router=express.Router()

router.get('/:userId/profile', getUserProfile);
router.get('/:articleId/:userId/savedarticlebyid', getsavedarticlebyid);
router.get('/:userId/saved-articles', getsavedarticle);
router.put('/savearticle', savedArticle);
router.put('/unsavearticle', unsavedArticle);
router.get('/:userId/recommend',getFilteredArticles );
export default router