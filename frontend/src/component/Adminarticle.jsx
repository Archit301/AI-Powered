import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Adminarticle = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const fetchArticles = async () => {
    console.log("hello",currentUser)
    try {
      const response = await axios.get(`/api/articles/getbyuser/${currentUser._id}`);
      setArticles(response.data);
    } catch (err) {
      setError('Error fetching articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedArticleId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/articles/${selectedArticleId}`);
      setShowDeleteModal(false);
      setSelectedArticleId(null);
      await fetchArticles(); // Re-fetch articles after deletion
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Error deleting article');
    }
  };

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Header Section */}
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">Manage Articles</h2>
        <Link
          to="/createarticle"
          className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition"
        >
          Create New Article
        </Link>
      </div>

      {/* Articles List */}
      <main className="container mx-auto">
        {articles.length === 0 ? (
          <p className="text-gray-600 text-center">No articles created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <Link to={`/adminarticleview/${article._id}`}>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>
                </Link>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/adminarticlesedit/${article._id}`}
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-600 font-medium hover:text-red-800"
                    onClick={() => handleDeleteClick(article._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this article?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Adminarticle;
