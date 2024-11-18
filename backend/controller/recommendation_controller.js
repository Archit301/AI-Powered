import { Recommendation } from "../models/recommendation_model.js";


export const generateRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const recommendations = await Recommendation.generateForUser(userId); // Assumes a static method for generation
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};
