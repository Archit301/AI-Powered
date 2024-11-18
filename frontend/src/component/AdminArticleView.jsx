// src/components/AdminArticleView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';

const AdminArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Polling interval in milliseconds
  const POLLING_INTERVAL = 5000;

  // Fetch Article Data
  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      console.log("hello")
      setArticle(response.data);
    } catch (err) {
      setError('Error fetching article');
      console.error('Error fetching article:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Comments Data
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/article/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Set up polling for live updates
  useEffect(() => {
    fetchArticle();
    fetchComments();

    const interval = setInterval(() => {
      fetchArticle(); // Fetch the latest article data
      fetchComments(); // Fetch the latest comments
    }, POLLING_INTERVAL);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === article.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? article.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">{error}</div>;
  if (!article) return <div className="text-center py-10">No article found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-12">
      {/* Article Header */}
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-xl mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">{article.title}</h2>

        {/* Article Stats */}
        <div className="flex items-center gap-6 text-lg text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <FaEye className="text-gray-500" />
            <span>{article.views}</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <FaThumbsUp />
            <span>{article.upvotes}</span>
          </div>
          <div className="flex items-center space-x-2 text-red-600">
            <FaThumbsDown />
            <span>{article.downvotes}</span>
          </div>
        </div>

        {/* Image Slider */}
        {article.images.length > 0 ? (
          <div className="relative w-full h-72 mb-6">
            <img
              src={article.images[currentImageIndex]}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
            >
              &#10094;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
            >
              &#10095;
            </button>
          </div>
        ) : (
          <div className="w-full h-72 bg-gray-300 rounded-lg mb-6"></div>
        )}

        {/* Article Content */}
        <p className="text-gray-700 text-lg leading-relaxed">{article.content}</p>
      </div>

      {/* Comments Section */}
      <div className="container mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h3 className="text-3xl font-semibold text-gray-800 mb-6">Comments</h3>

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-6 bg-gray-50 rounded-lg shadow-md transition hover:shadow-lg"
              >
                <div className="flex items-center mb-2">
                  <div className="font-semibold text-gray-800">{comment.user}</div>
                </div>
                <p className="text-gray-600">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArticleView;
