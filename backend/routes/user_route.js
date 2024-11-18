import express from "express"
import { followUser, getfollowuser, getUserProfile, google, login, registerUser, signout, UnfollowUser, updateUserProfile } from "../controller/user_controller.js";

const router=express.Router()
router.post('/register', registerUser);
router.post('/login',login);
router.get('/:articleId/:userId',getfollowuser);
router.get('/:userId/profile', getUserProfile);
router.put('/:userId/profile',updateUserProfile);
router.post('/:userId/follow/:followUserId',followUser);
router.post('/:userId/unfollow/:followUserId',UnfollowUser);
router.post('/google',google)
router.post('/signout',signout)
export default router;