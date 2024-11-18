import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
function Homepage() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const navigate=useNavigate()
  // Function to fetch latest articles
  const fetchLatestArticles = async () => {
    try {
      const response = await fetch("/api/articles/newarticle");
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setLatestArticles(data);
      } else {
        console.error("Failed to fetch articles.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  // Function to fetch new questions
  const fetchNewQuestions = async () => {
    try {
      const response = await fetch("/api/questions/newquestion");
      if (response.ok) {
        const data = await response.json();
        setNewQuestions(data);
      } else {
        console.error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Polling for articles and questions every 10 seconds
  useEffect(() => {
    fetchLatestArticles();
    fetchNewQuestions();
    const interval = setInterval(() => {
      fetchLatestArticles();
      fetchNewQuestions();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);


  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}...` : text;
  };

  const handleReadMore = async (articleId) => {
    try {
      // Update the view count
      alert("hello")
      await axios.put(`/api/articles/view/${articleId}`);
      // Navigate to the article's detail page
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error("Error updating views or navigating:", error);
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to KnowledgeHub</h1>
          <p className="text-lg md:text-xl mb-6">
            Discover insights, ask questions, and share knowledge on topics that matter.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
            Get Started
          </button>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {latestArticles.length > 0 ? (
          latestArticles.map((article) => (
            <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={article.images[0] || "https://via.placeholder.com/400x200?text=Default+Image"}
                alt={article.title || "Article Image"}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 truncate">{article.title || "Untitled Article"}</h3>
                <p className="text-gray-600 mb-2 truncate">
                  {article.summary || "No summary available."}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Author: {article.author.username || "Unknown Author"}
                </p>
                <button   onClick={() => handleReadMore(article._id)}
                 className="text-blue-500 font-semibold hover:underline">Read more</button>
              </div>
            </div>
          ))
          ) : (
            <p className="text-center text-gray-600">No articles available at the moment.</p>
          )}
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="bg-gray-50 py-12 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Explore Popular Topics</h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {["AI", "Technology", "Health", "Science", "Business"].map((topic) => (
            <button
              key={topic}
              className="bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-200"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* Questions & Answers Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center mb-6">Questions & Answers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {newQuestions.length > 0 ? (
            newQuestions.map((question) => (
              <div key={question.id} className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{question.questionText || "Untitled Question"}</h3>
                <p className="text-gray-600 mb-4">
                  {question.description || "No description available."}
                </p>
                <button className="text-blue-500 font-semibold hover:underline">View answers</button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No questions available at the moment.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-800 text-white py-12 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Share Your Knowledge?</h2>
        <p className="text-lg mb-6">Join the community and make an impact by sharing your expertise.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
          Join Now
        </button>
      </section>
    </div>
  );
}

export default Homepage;
