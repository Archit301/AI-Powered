import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState("trending");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const navigate = useNavigate();

  // Function to fetch all articles based on the selected filter
  const fetchArticles = async () => {
    try {
      let url = "/api/articles/"; // Default to "All"
      if (filter === "trending") {
        url = "/api/articles/trending";
      } else if (filter === "recent") {
        url = "/api/articles/recent";
      } else if (filter === "all") {
        url = "/api/articles/";
      }

      const response = await axios.get(url);
      console.log(response.data);
      setArticles(response.data); // Assuming the API returns all articles without pagination
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  // Polling function to refresh articles every 30 seconds
  useEffect(() => {
    fetchArticles();
    const interval = setInterval(fetchArticles, 15000); // Fetch every 15 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [filter]);

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to calculate the total number of pages
  const totalPages = () => {
    return Math.ceil(articles.length / articlesPerPage);
  };

  // Calculate which articles to display based on the current page
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handleReadMore = async (articleId) => {
    try {
      await axios.put(`/api/articles/view/${articleId}`);
      // Navigate to the article's detail page
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error("Error updating views or navigating:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Articles</h1>

      {/* Filter Section */}
      <div className="flex justify-end mb-6">
        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="trending">Trending</option>
          <option value="recent">Most Recent</option>
          <option value="all">All</option>
        </select>
      </div>

      {/* No Articles Message */}
      {articles.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No articles found for the selected filter. Please try again later.
        </div>
      ) : (
        // Articles List
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentArticles.map((article) => (
            <div
              key={article._id}
              className="border rounded-lg p-4 hover:shadow-lg transition duration-300 h-full"
            >
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-sm text-gray-500 mb-1">By {article.author}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{article.summary}</p>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-sm">
                  {article.likedBy.length} Likes • {article.views} Views
                </div>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-500"
                  onClick={() => handleReadMore(article._id)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 bg-gray-200 rounded-l-lg"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 rounded-r-lg ml-1"
          disabled={currentPage === totalPages()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArticlesPage;
