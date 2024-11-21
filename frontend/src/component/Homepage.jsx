import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
function Homepage() {
  const [latestArticles, setLatestArticles] = useState([]);
  const {currentUser,error,loading}= useSelector((state)=>state.user)
  const [recommendedArticles, setRecommendedArticles] = useState([]);
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


  const fetchRecommendedArticles = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/profile/${currentUser._id}/recommend`);
      if (response.ok) {
        const data = await response.json();
        setRecommendedArticles(data);
      } else {
        console.error("Failed to fetch recommended articles.");
      }
    } catch (error) {
      console.error("Error fetching recommended articles:", error);
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
    fetchRecommendedArticles()
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
      // alert("hello")
      await axios.put(`/api/articles/view/${articleId}`);
      // Navigate to the article's detail page
      navigate(`/article/${articleId}` );
    } catch (error) {
      console.error("Error updating views or navigating:", error);
    }
  };

  return (
    <div className="bg-gray-100 mt-10">
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
<div className="relative">
  <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth">
    {latestArticles.length > 0 ? (
      latestArticles.map((article) => (
        <div key={article.id} className="bg-white shadow-lg rounded-lg flex-none w-72 sm:w-80">
          <img
            src={article.images[0] || "https://via.placeholder.com/1200x500?text=Default+Image"}
            alt={article.title || "Article Image"}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">{article.title || "Untitled Article"}</h3>
            <p className="text-gray-600 mb-2 truncate">{truncateText(article.summary || "", 15)}</p>
            <button onClick={() => handleReadMore(article._id)} className="text-blue-500 font-semibold hover:underline">
              Read more
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-600">No articles available at the moment.</p>
    )}
  </div>
</div>
</section>




{currentUser && recommendedArticles.length > 0 && (
    <section className="py-12 px-6 md:px-12 lg:px-24">
    <h2 className="text-3xl font-semibold text-center mb-6">Recommended Articles for You</h2>
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth">
            {recommendedArticles.map((article) => (
              <div key={article.id} className="bg-white shadow-lg rounded-lg w-72">
                <img
                  src={article.images[0] || "https://via.placeholder.com/1200x500?text=Default+Image"}
                  alt={article.title || "Article Image"}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 truncate">{article.title || "Untitled Article"}</h3>
                  <p className="text-gray-600 mb-2 truncate">{truncateText(article.summary || "", 15)}</p>
                  <button
                    onClick={() => handleReadMore(article._id)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Read more
                  </button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>
      )}


      {/* Questions & Answers Section */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
<h2 className="text-3xl font-semibold text-center mb-6">Explore Popular Question</h2>
<div className="relative">
  <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth">
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
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="bg-gray-800 text-white py-12 px-6 md:px-12 lg:px-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Share Your Knowledge?</h2>
        <p className="text-lg mb-6">Join the community and make an impact by sharing your expertise.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
          Join Now
        </button>
      </section> */}
    </div>
  );
}

export default Homepage;