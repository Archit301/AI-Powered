import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const [totalComments, setTotalComments] = useState(0);
  const [stats, setStats] = useState({ totalLikes: 0, totalDislikes: 0, totalViews: 0 });
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [popularArticles, setPopularArticles] = useState([]);
  const [popularQuestions, setPopularQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0); // New state for total questions
  const [totalArticles, setTotalArticles] = useState(0);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  
  // Fetch data from APIs
  const fetchData = async () => {
    const userId = currentUser._id;
    try {
      // Fetch total comments
      const commentsRes = await fetch(`/api/profile/${userId}/totalcomment`);
      const commentsData = await commentsRes.json();
      setTotalComments(commentsData.totalComments);

      // Fetch stats (likes, dislikes, views)
      const statsRes = await fetch(`/api/profile/${userId}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch total followers
      const followersRes = await fetch(`/api/profile/${userId}/totalfollowers`);
      const followersData = await followersRes.json();
      setTotalFollowers(followersData.totalFollowers);

      // Fetch popular articles and questions
      const popularRes = await fetch(`/api/profile/${userId}/popular`);
      const popularData = await popularRes.json();
      setPopularArticles(popularData.popularArticle ? [popularData.popularArticle] : []);
      setPopularQuestions(popularData.popularQuestion ? [popularData.popularQuestion] : []);


      const totalArticleRes = await fetch(`/api/profile/${currentUser._id}/totalarticle`);
      const totalArticleData = await totalArticleRes.json();
      setTotalQuestions(totalArticleData.question); // Set the total questions
      setTotalArticles(totalArticleData.article); 

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit ? `${words.slice(0, wordLimit).join(" ")}...` : text;
  };
  // Polling every 10 seconds
  useEffect(() => {
    fetchData(); // Initial data fetch
    const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Followers/Statistics */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Followers</h3>
            <p className="text-lg">Total Followers: <span className="font-semibold">{totalFollowers}</span></p>
          </div>

          {/* Likes/Dislikes */}
          <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Likes & Dislikes</h3>
            <p className="text-lg">Total Likes: <span className="font-semibold">{stats.totalLikes}</span></p>
            <p className="text-lg">Total Dislikes: <span className="font-semibold">{stats.totalDislikes}</span></p>
          </div>

          {/* Comments/Views */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Comments & Views</h3>
            <p className="text-lg">Total Comments: <span className="font-semibold">{totalComments}</span></p>
            <p className="text-lg">Total Views: <span className="font-semibold">{stats.totalViews}</span></p>
          </div>
          

          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Total Questions</h3>
            <p className="text-lg">Total Questions: <span className="font-semibold">{totalQuestions}</span></p>
          </div>

          {/* Total Articles */}
          <div className="bg-gradient-to-br from-red-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Total Articles</h3>
            <p className="text-lg">Total Articles: <span className="font-semibold">{totalArticles}</span></p>
          </div>


      


        </div>
        <section className="py-12 px-6 md:px-12 lg:px-24 flex justify-center">
  <div className="w-full max-w-7xl">
    <h2 className="text-3xl font-semibold text-center mb-6">Popular Articles</h2>
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth justify-center">
        {popularArticles.length > 0 ? (
          popularArticles.map((article, index) => (
            <div key={article.id} className="bg-white shadow-lg rounded-lg flex-none w-72 sm:w-80">
              <img
                src={article.images[0] || "https://via.placeholder.com/1200x500?text=Default+Image"}
                alt={article.title || "Article Image"}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 truncate">{article.title || "Untitled Article"}</h3>
                <p className="text-gray-600 mb-2 truncate">{truncateText(article.summary || "", 15)}</p>
                <p className="text-gray-600 mb-2 truncate">Views: {article.views}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No articles available at the moment.</p>
        )}
      </div>
    </div>
  </div>
</section>
      </main>
    </div>
  );
};

export default AdminDashboard;
