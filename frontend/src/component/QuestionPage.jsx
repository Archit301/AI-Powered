import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch list of questions from the API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/questions/');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Loading and error handling
  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-6 py-12 mt-10">
    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Questions</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {questions.map((question) => (
        <div
          key={question.id}
          className="max-w-sm w-full bg-white shadow-md rounded-xl p-6 mb-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Link to={`/question/${question._id}`} className="block">
            <div className="flex flex-col items-center">
              {/* Question title */}
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center hover:text-blue-600 transition-colors duration-300">
                {question.questionText}
              </h3>
  
              {/* Question category */}
              <p className="text-gray-500 text-sm text-center mb-2">Category: {question.category}</p>
  
              {/* Author name */}
              <p className="text-gray-600 text-sm text-center mb-2">Author: {question.author.username}</p>
              <p className="text-gray-600 text-sm text-center mb-4">CreatedAt: {new Date(question.createdAt).toLocaleDateString()}</p>

              {/* View Details link */}
              <p className="text-blue-500 font-semibold text-sm text-center hover:text-blue-700 transition-colors duration-300">
                View Answers
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
  
  );
};
export default QuestionPage;
