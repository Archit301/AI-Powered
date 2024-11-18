import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function ArticlePage() {
  const { currentUser  } = useSelector((state) => state.user);
  const [article, setArticle] = useState(null);
  const [views, setViews] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [sentiment, setSentiment] = useState({ label: '', score: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [showSentiment, setShowSentiment] = useState(false);
  const articleId = window.location.pathname.split("/").pop();
  const userId = currentUser ._id;

  useEffect(() => {
    fetchArticle();
    fetchViews();
    checkIfUserIsFollowed();
    fetchComments();
    fetchLikesDislikes();
  }, []);

  useEffect(() => {
    const viewInterval = setInterval(fetchViews, 9000);
    const commentsInterval = setInterval(fetchComments, 9000);
    const likesDislikesInterval = setInterval(fetchLikesDislikes, 9000);
    return () => {
      clearInterval(viewInterval);
      clearInterval(commentsInterval);
      clearInterval(likesDislikesInterval);
    };
  }, []);

  const analyzeSentiment = async () => {
    if (!translatedContent) {
      console.error("Content to analyze is empty.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        { inputs: translatedContent },
        {
          headers: {
            Authorization: `Bearer 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`, // Replace with your API key
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedSentiments = response.data[0].sort((a, b) => b.score - a.score);
        setSentiment({
          label: sortedSentiments[0].label,
          score: sortedSentiments[0].score.toFixed(2),
        });
      } else {
        console.error("Invalid response format from the API.");
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForSentiment = (score) => {
    if (score >= 0.7) return 'bg-green-500';  // Positive
    if (score <= 0.3) return 'bg-red-500';    // Negative
    return 'bg-yellow-500';                  // Neutral
  };

  const checkIfUserIsFollowed = async () => {
    try {
      const { data } = await axios.get(`/api/users/${articleId}/${userId}`);
      setIsFollowed(data.message === "User  followed");
    } catch (error) {
      console.error("Error checking follow status:", error.message);
    }
  };

  const fetchArticle = async () => {
    try {
      const { data } = await axios.get(`/api/articles/${articleId}`);
      setArticle(data);
      setTranslatedContent(data.content);
    } catch (error) {
      console.error("Error fetching article:", error.message);
    }
  };

  const fetchViews = async () => {
    try {
      const { data } = await axios.get(`/api/articles/${articleId}`);
      setViews(data.views);
    } catch (error) {
      console.error("Error fetching views:", error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/article/${articleId}`);
 setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const fetchLikesDislikes = async () => {
    try {
      const { data } = await axios.get(`/api/articles/${articleId}/likes-dislikes`);
      setLikeCount(data.likeCount);
      setDislikeCount(data.dislikeCount);

      if (data.likedId.length > 0) {
        setLiked(data.likedId.some(user => user._id === userId));
      }

      if (data.dislikeId.length > 0) {
        setDisliked(data.dislikeId.some(user => user._id === userId));
      }
    } catch (error) {
      console.error("Error fetching likes/dislikes:", error.message);
    }
  };

  const handleLike = async () => {
    if (!liked) {
      try {
        await axios.post(`/api/articles/${articleId}/like`, { userId });
        setLiked(true);
        setDisliked(false);
        fetchLikesDislikes();
      } catch (error) {
        console.error("Error liking article:", error.message);
      }
    }
  };

  const handleDislike = async () => {
    if (!disliked) {
      try {
        await axios.post(`/api/articles/${articleId}/dislike`, { userId });
        setDisliked(true);
        setLiked(false);
        fetchLikesDislikes();
      } catch (error) {
        console.error("Error disliking article:", error.message);
      }
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowed) {
        await axios.post(`/api/users/${userId}/unfollow/${article.author._id}`);
      } else {
        await axios.post(`/api/users/${userId}/follow/${article.author._id}`);
      }
      setIsFollowed(!isFollowed);
    } catch (error) {
      console.error("Error following/unfollowing user:", error.message);
    }
  };

  const postComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post(`/api/comments/`, {
          articleId,
          content: newComment,
          author: userId,
        });
        setNewComment("");
        fetchComments();
      } catch (error) {
        console.error("Error posting comment:", error.message);
      }
    }
  };

  const translateContent = async (lang) => {
    try {
      const { data } = await axios.post(`/api/translate`, {
        text: article.content,
        target: lang,
      });
      setTranslatedContent(data.translatedText);
      setLanguage(lang);
    } catch (error) {
      console.error("Error translating content:", error.message);
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
    {article ? (
      <>
        <div className="max-w-screen-lg mx-auto py-6 px-4 mt-14 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg">
          <h1 className="text-5xl font-extrabold text-center sm:text-left text-white mb-6">
            {article?.title || "Loading..."}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
  {article.images.map((image, index) => (
    <div key={index} className={`relative w-full ${article.images.length === 1 ? 'h-screen' : 'h-64'} overflow-hidden rounded-lg shadow-xl`}>
      <img
        src={image}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  ))}
</div>

        <div className="flex justify-between items-center py-4 px-6 bg-gray-100 rounded-lg shadow-md mx-4 sm:mx-0 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              className={`px-6 py-2 rounded-md ${liked ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} transition duration-200 hover:bg-blue-500`}
            >
              👍 Like ({likeCount})
            </button> <button
              onClick={handleDislike}
              className={`px-6 py-2 rounded-md ${disliked ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"} transition duration-200 hover:bg-red-500`}
            >
              👎 Dislike ({dislikeCount})
            </button>
          </div>
          
          <div className="text-gray-700 font-medium text-right">
            Views: {views}
          </div>
        </div>

        <div className="mt-6 px-6">
          <p className="text-lg text-gray-700">
            {translatedContent || "Content not available"}
          </p>
        </div>

        <div className="mx-4 sm:mx-0 mb-6">
          <h2 className="text-2xl text-gray-800 mb-3">Sentiment Analysis</h2>
          <button
            onClick={() => {
              setShowSentiment(!showSentiment);
              if (!showSentiment) analyzeSentiment(); // Only analyze sentiment if showing
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 transition duration-200 hover:bg-blue-600"
          >
            {showSentiment ? "Hide Sentiment" : "Show Sentiment"}
          </button>
          {showSentiment && (
            <div className={`text-white p-4 rounded-lg ${getColorForSentiment(parseFloat(sentiment.score))}`}>
              <p className="text-xl">Sentiment: {sentiment.label}</p>
              <p className="text-lg">Score: {sentiment.score}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end text-sm text-gray-400 ml-4 mr-4">
          Published On: {new Date(article.createdAt).toLocaleDateString()}
        </div>

        <div className="max-w-screen-xl mx-auto py-6 px-4 flex-grow">
          <div className="flex justify-between items-center mb-6 bg-white py-6 px-8 rounded-lg shadow-xl border-t-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <a
                href={`/author/${article.author?.username || ""}`}
                className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"
              >
                <img
                  src={article.author?.avatar || "/path/to/placeholder.jpg"}
                  alt="Author"
                  className="w-full h-full object-cover rounded-full"
                />
              </a>
              <div className="text-left">
                <p className="text-xl font-semibold text-gray-800">
                  <a
                    href={`/author/${article.author?.username || ""}`}
                    className="hover:text-blue-600 mr-8"
                  >
                    {article.author?.username || "Unknown"}
                  </a>
                </p>
              </div>
            </div>

            <button
              onClick={handleFollow}
              className={`px-8 py-3 rounded-full text-lg font-semibold ${isFollowed ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"} transition duration-200 hover:bg-green-500`}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6 mt-6 mx-4 sm:mx-0 mb-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="Add a comment..."
          ></textarea>
          <button
            onClick={postComment}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 transition duration-200 hover:bg-blue-700"
          >
            Post Comment
          </button>
          <div className="mt-6">
            {comments.map((comment, index) => {
              const isExpanded = comment.isExpanded || false; // Check if the comment is expanded
              const commentWords = comment.content.split(' '); // Split the comment into words
              const displayContent = isExpanded ? comment.content : commentWords.slice(0, 10).join(' '); // Display full or truncated content
              const showReadMore = commentWords.length > 10; // Check if the comment has more than 10 words

              return (
                <div key={index} className="mb-4 border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={comment.author?.avatar || '/path/to/placeholder.jpg'}
                      alt={comment.author?.username || "User "}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{comment.author?.username || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{displayContent}</p>
                  {showReadMore && !isExpanded && (
                    <button
                      onClick={() => {
                        comment.isExpanded = true; // Set the comment to expanded
                        setComments([...comments]); // Update the state
                      }}
                      className="text-blue-500 hover:underline mt-1"
                    >
                      Read More
                    </button>
                  )}
                  {isExpanded && (
                    <small className="text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    ) : (
      <div>Loading...</div>
    )}
  </div>

  );
}

export default ArticlePage;