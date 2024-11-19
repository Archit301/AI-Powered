import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const AuthorProfile = () => {
  const [authorData, setAuthorData] = useState(null);
  const [articles, setArticles] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(`/api/profile/${id}/profile`);
        const data = response.data;
        setAuthorData(data.user);
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };
    fetchAuthorData();
  }, [id]);

  const defaultAvatar =
    "https://www.w3schools.com/w3images/avatar2.png";
  const defaultBio =
    "This author hasn't provided a bio yet. Stay tuned for more articles!";

  if (!authorData) {
    return <div>Loading...</div>;
  }

  // Handle article click to update view count and navigate
  const handleArticleClick = async (articleId) => {
    try {
      // Send the PUT request to update the view count
      await axios.put(`/api/articles/view/${articleId}`);
      // Navigate to the article's detail page after the view count is updated
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 mt-10 pt-10">
      {/* Author Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 mb-16 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={authorData.avatar==="defaultProfilePicUrl"?"https://www.w3schools.com/w3images/avatar2.png":authorData.avatar}
            alt={authorData.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <h2 className="text-4xl font-semibold">{authorData.username}</h2>
          <p className="text-lg max-w-3xl text-center">
            {authorData.bio || defaultBio}
          </p>
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Recent Articles</h2>
        
        {/* Check if there are any articles */}
        {articles.length === 0 ? (
          <p className="text-lg text-gray-600">No articles available from this author.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-2xl hover:transform hover:scale-105 transition-all duration-300 cursor-pointer h-auto"
                onClick={() => handleArticleClick(article._id)} // On click, update view count and navigate
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
    {article.summary?.length > 100 ? `${article.summary.substring(0, 100)}...` : article.summary}
  </p>

  <div className="flex justify-between items-center text-gray-600 text-sm mt-4">
    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
    <span className="flex items-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 2a7 7 0 100 14 7 7 0 000-14zm0 12a5 5 0 110-10 5 5 0 010 10z"
          clipRule="evenodd"
        />
      </svg>
      <span className="ml-1">{article.views} Views</span>
    </span>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile;
