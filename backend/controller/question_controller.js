import { Question } from "../models/question_model.js";
import { Answer } from "../models/answer_model.js";
import { IdentificationIcon } from "@heroicons/react/16/solid";

export const postQuestion = async (req, res) => {
    try {
        const { questionText, author, category, tags } = req.body;
        const question = new Question({ questionText, author, category, tags });
        await question.save();
        res.status(201).json({ message: 'Question posted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post question' });
    }
}

export const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('author', 'username');
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

export const getQuestionsbyUserId = async (req, res) => {
    try {
        const questions = await Question.find({author:req.params.id}).populate('author', 'username');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};
export const answerQuestion = async (req, res) => {
    try {
        const { answerText, author, questionId } = req.body;
        const answer = new Answer({ answerText, author, question: questionId });
        await answer.save();
        res.status(201).json({ message: 'Answer posted', answer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post answer' });
    }
};


export const getAnswerbyUserId = async (req, res) => {
    try {
        const questions = await Answer.find({question:req.params.id}).populate('question');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};


export const deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
};


export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const {questionText,category,tags}=req.body
   console.log(id)
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {questionText,category,tags}, 
            { new: true } 
        );
         console.log(updatedQuestion)
        if (!updatedQuestion) {
            console.log("hello")
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json({ message: 'Question updated successfully', data: updatedQuestion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to update question' });
    }
};


export const getQuestionsbyId = async (req, res) => {
    try {
        const questions = await Question.findById(req.params.id).populate('author', 'username');
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};




export const newquestion=async(req,res)=>{
    try {
        const articles = await Question.find()
  .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
  .limit(5); // Limit the results to 5
//   console.log("hii")
res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    } 
}