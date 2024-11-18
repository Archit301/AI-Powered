import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminQuestion = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [questions, setQuestions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Fetch questions from the API
  useEffect(() => {
    fetch(`/api/questions/${currentUser._id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data); // Setting the fetched data
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  // Handle delete button click - show confirmation modal
  const handleDeleteClick = (questionId) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    fetch(`/api/questions/${questionToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        // Remove the deleted question from the state
        setQuestions(questions.filter((question) => question._id !== questionToDelete));
        setShowDeleteModal(false);
      })
      .catch((error) => console.error('Error deleting question:', error));
  };

  // Handle cancel delete action
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      {/* Header */}
      <div className="container mx-auto flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Manage Questions</h2>
        <Link
          to="/adminaddquestion"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-all duration-300"
        >
          Create New Question
        </Link>
      </div>

      {/* Question Cards */}
      <main className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <div
            key={question._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Link to Question Detail View */}
            <Link
              to={`/admin/questions/view/${question._id}`}
              className="block mb-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {question.questionText}
              </h3>
            </Link>

            <p className="text-gray-600">{question.comments ? question.comments : 0} comments</p>
            <div className="mt-4 flex justify-start space-x-6">
              <Link
                to={`/adminquestionedit/${question._id}`}
                className="text-blue-600 hover:text-blue-800 transition-all duration-300"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDeleteClick(question._id)}
                className="text-red-600 hover:text-red-800 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this question?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestion;
