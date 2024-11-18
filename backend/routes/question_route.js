import express from "express"
import { answerQuestion, deleteQuestion, getAnswerbyUserId, getQuestions, getQuestionsbyId, getQuestionsbyUserId, newquestion, postQuestion, updateQuestion } from "../controller/question_controller.js";

const router = express.Router();
router.post('/', postQuestion);
router.get('/newquestion', newquestion);
router.get('/',getQuestions);
router.get('/:id',getQuestionsbyUserId);
router.get('/answer/:id',getAnswerbyUserId);
router.post('/:questionId/answer', answerQuestion);
router.delete('/:id',deleteQuestion);

router.put('/update/:id',updateQuestion)
router.get('/question/:id',getQuestionsbyId);
export default router