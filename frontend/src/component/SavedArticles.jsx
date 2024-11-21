import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SavedArticles = () => {
    const [savedArticles, setSavedArticles] = useState([]);
    const { currentUser  } = useSelector((state) => state.user);
    const navigate = useNavigate();

    // Fetch saved articles
    useEffect(() => {
        const fetchSavedArticles = async () => {
            try {
                const response = await axios.get(`/api/profile/${currentUser._id}/saved-articles`);
                const articles = response.data.user.savedArticles || [];
                setSavedArticles(articles);
            } catch (error) {
                console.error("Error fetching saved articles:", error);
            }
        };
        fetchSavedArticles();
    }, [currentUser._id]);

    // Handle click on an article
    const handleArticleClick = async (articleId) => {
        try {
            await axios.put(`/api/articles/view/${articleId}`); // Update view count
            navigate(`/article/${articleId}`); // Navigate to the article detail page
        } catch (error) {
            console.error("Error updating view count:", error);
        }
    };

    if (!savedArticles.length) {
        return <p className="text-center text-gray-600">No saved articles yet.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-8 mt-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Saved Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedArticles.map((article) => (
                    <div
                        key={article._id}
                        className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => handleArticleClick(article._id)}
                    >
                        <img
                            src={article.images[0]}
                            alt={article.title}
                            className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {article.summary}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedArticles;
