import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const AdminEditQuestion = () => {
  const [formData, setFormData] = useState({
    questionText: '',
    author: '',
    category: '',
    tags: [],
  });
  const [categories] = useState(['AI', 'Technology', 'Health', 'Business', 'Lifestyle', 'Others']);
  const { id } = useParams(); // Extract ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`/api/questions/question/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            questionText: data.questionText,
            author: data.author.username, // Use author's username for display
            category: data.category,
            tags: data.tags,
          });
        })
        .catch((error) => console.error('Error fetching question:', error));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    if (value && !formData.tags.includes(value)) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, value],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.category === '') {
      alert('Please select a category');
      return;
    }

    fetch(`/api/questions/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/adminquestion');
      })
      .catch((error) => {
        console.error('Error updating question:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="container mx-auto flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Edit Question</h2>
        <Link
          to="/admin/questions"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transition-all duration-300"
        >
          Back to Questions
        </Link>
      </div>

      <main className="container mx-auto bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="questionText" className="block text-gray-700 text-lg font-medium mb-2">
              Question Text
            </label>
            <textarea
              id="questionText"
              name="questionText"
              rows="4"
              value={formData.questionText}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-gray-700 text-lg font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 text-lg font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-gray-700 text-lg font-medium mb-2">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value=""
              onChange={handleTagChange}
              placeholder="Enter tag and press Enter"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex flex-wrap space-x-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300"
            >
              Update Question
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminEditQuestion;
