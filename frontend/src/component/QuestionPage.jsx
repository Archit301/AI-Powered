import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, User, MessageCircle } from "react-feather";

const QuestionPage = () => {
  const [upvotes, setUpvotes] = useState(125);
  const [downvotes, setDownvotes] = useState(10);
  const [comments, setComments] = useState([
    { id: 1, user: "Alice", text: "I had a similar question about this topic." },
    { id: 2, user: "Bob", text: "This explanation is very helpful, thanks!" },
  ]);

  const addComment = (comment) => setComments([...comments, comment]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Question Header */}
      <header className="space-y-4 md:flex md:justify-between md:items-center md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">How does AI impact the job market?</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="text-gray-500" />
            <span className="ml-2 text-gray-700 font-semibold">Asked by John Doe</span>
          </div>
        </div>
      </header>

      {/* Tags Section */}
      <div className="flex flex-wrap gap-2">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">AI</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Jobs</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">Technology</span>
      </div>

      {/* Voting and Description Section */}
      <div className="space-y-4 md:flex md:space-y-0 md:space-x-6">
        {/* Voting Section */}
        <div className="flex md:flex-col md:items-center space-x-4 md:space-x-0 md:space-y-2 text-gray-600">
          <button
            onClick={() => setUpvotes(upvotes + 1)}
            className="flex items-center space-x-1 hover:text-blue-600"
          >
            <ThumbsUp />
            <span>{upvotes}</span>
          </button>
          <button
            onClick={() => setDownvotes(downvotes + 1)}
            className="flex items-center space-x-1 hover:text-red-600"
          >
            <ThumbsDown />
            <span>{downvotes}</span>
          </button>
        </div>

        {/* Question Description */}
        <div className="text-gray-700 md:flex-1">
          <p>
            Artificial Intelligence (AI) has profound implications for the future of work. As AI technology continues to
            advance, it could lead to a shift in job roles, with repetitive tasks increasingly being automated...
          </p>
        </div>
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

export default QuestionPage;
