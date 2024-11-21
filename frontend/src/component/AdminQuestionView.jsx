import React, { useState, useEffect } from "react";
import { User } from "react-feather";
import axios from "axios";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

const AdminQuestionView = () => {
  const { id } = useParams(); // Getting question ID from the URL
  const questionId = id;
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  
  // Fetch question and answers when the component is mounted
  useEffect(() => {
    // Fetch question details (author, category, tags, etc.)
    axios
      .get(`/api/questions/question/${questionId}`)
      .then((response) => {
        setQuestion(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
      });

    // Poll for answers every 5 seconds (shorter interval for faster response)
    const interval = setInterval(() => {
      axios
        .get(`/api/questions/answer/${questionId}`)
        .then((response) => {
          setAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching answers:", error);
        });
    }, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [questionId]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (newAnswer.trim()) {
      const newAnswerData = {
        answerText: newAnswer,
        author: currentUser._id,
        questionId,
      };

      // Optimistically add the new answer to the UI
      setAnswers((prevAnswers) => [newAnswerData, ...prevAnswers]);

      // Post the answer to the API
      axios
        .post(`/api/questions/${questionId}/answer`, newAnswerData)
        .then((response) => {
          setNewAnswer(""); // Clear input field after submitting
        })
        .catch((error) => {
          console.error("Error posting answer:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Question Header */}
      <header className="space-y-4 md:flex md:justify-between md:items-center md:space-y-0 mt-20">
        <h1 className="text-3xl font-bold text-gray-800">{question.questionText}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="text-gray-500" />
            <span className="ml-2 text-gray-700 font-semibold">
              Asked by {question.author?.username}
            </span>
          </div>
        </div>
      </header>

      {/* Tags and Category Section */}
      <div className="flex flex-wrap gap-2">
        {question.category && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {question.category}
          </span>
        )}
        {question.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Answers Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Answers</h2>
        
        {/* Conditionally render message if no answers */}
        {answers.length === 0 ? (
          <p className="text-gray-600 italic">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer.id}
                className="p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <User className="text-gray-500" />
                  <p className="text-gray-700 font-semibold">
                    {answer.author?.username}
                  </p>
                </div>
                <p className="text-gray-600">{answer.answerText}</p>
                <p className="text-gray-600">{new Date(answer.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminQuestionView;
