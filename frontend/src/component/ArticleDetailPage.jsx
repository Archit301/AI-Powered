import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, User, MessageSquare } from "react-feather";

const ArticleDetailPage = () => {
  const [likes, setLikes] = useState(120);
  const [dislikes, setDislikes] = useState(12);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: "Alice", text: "Great article! Very insightful." },
    { id: 2, user: "Bob", text: "Interesting take on the subject." },
  ]);

  const toggleFollow = () => setIsFollowing(!isFollowing);
  const addComment = (comment) => setComments([...comments, comment]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Article Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Understanding AI and Machine Learning</h1>
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <User className="text-gray-500" />
            <span className="text-gray-700 font-semibold">Written by John Doe</span>
            <button
              onClick={toggleFollow}
              className={`px-4 py-2 rounded-lg font-semibold ${isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} hover:bg-opacity-80 transition`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </header>

      {/* Article Image */}
      <div className="w-full h-64 md:h-96 bg-gray-300 rounded-lg overflow-hidden">
        <img
          src="https://via.placeholder.com/800x400"
          alt="Article Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Info */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">AI</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Machine Learning</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Technology</span>
        </div>
        <p className="text-gray-700 leading-relaxed">
          AI and machine learning are transforming industries and reshaping the way we interact with technology...
        </p>
      </section>

      {/* Like & Dislike Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setLikes(likes + 1)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
        >
          <ThumbsUp />
          <span>{likes}</span>
        </button>
        <button
          onClick={() => setDislikes(dislikes + 1)}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
        >
          <ThumbsDown />
          <span>{dislikes}</span>
        </button>
      </div>

      {/* Comments Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-lg">
              <p className="text-gray-700 font-semibold">{comment.user}</p>
              <p className="text-gray-600">{comment.text}</p>
            </div>
          ))}
        </div>
        <AddComment onAddComment={addComment} />
      </section>
    </div>
  );
};

// Component for adding a new comment
const AddComment = ({ onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment({ id: Date.now(), user: "You", text: newComment });
      setNewComment("");
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-2">
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        rows="3"
      />
      <button
        type="submit"
        className="self-end px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
      >
        Post Comment
      </button>
    </form>
  );
};

export default ArticleDetailPage;
