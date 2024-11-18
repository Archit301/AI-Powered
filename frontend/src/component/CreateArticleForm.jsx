import React, { useState } from 'react';
import { app } from '../firebase'; // Import the Firebase storage instance
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';

const CreateArticleForm = ({ onSubmit }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: currentUser._id,
    tags: '',
    category: '',
    images: [],
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [formError, setFormError] = useState('');
  const [aiContentSuggestion, setAiContentSuggestion] = useState('');
  const [aiSummarySuggestion, setAiSummarySuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setFiles(e.target.files);
  };

  // Fetch AI suggestion for content or summary
  const fetchSuggestions = async (type) => {
    try {
      setLoading(true); // Set loading state
      const textToAnalyze = type === 'content' ? formData.content : formData.summary;

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
        {
          inputs: textToAnalyze,
          parameters: {
            max_length: 150,
            do_sample: false,
            temperature: 0.7,
          },
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            'Content-Type': 'application/json',
          },
        }
      );

      const suggestion = response.data[0].generated_text || 'No suggestion available';
      if (type === 'content') {
        setAiContentSuggestion(suggestion); // Save suggestion to state
      } else {
        setAiSummarySuggestion(suggestion); // Save summary suggestion to state
      }
      setLoading(false); // Reset loading state
    } catch (error) {
      setLoading(false);
      console.error('Error fetching AI suggestions:', error);
    }
  };

  // Handle form submission and upload images to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 0 && files.length + formData.images.length < 7) {
      setUploading(true);
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise)
        .then((urls) => {
          setFormData((prevState) => ({
            ...prevState,
            images: prevState.images.concat(urls),
          }));
          setUploading(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError('Image upload failed (2 MB max per image)');
        });
    } else {
      setUploading(false);
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  // Store image in Firebase Storage
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  // Create article API call
  const createArticle = async () => {
    try {
      const response = await axios.post('/api/articles/', formData);
      const message = response.data.message;
      console.log(message);
      navigate('/adminarticle');
    } catch (error) {
      setFormError('There was an error creating the article');
      console.error('There was an error creating the article:', error);
    }
  };

  // Replace content or summary with AI suggestion
  const handleReplaceContent = (type) => {
    if (type === 'content') {
      setFormData((prevData) => ({
        ...prevData,
        content: aiContentSuggestion,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        summary: aiSummarySuggestion,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Article</h2>
      <form onSubmit={(e) => { e.preventDefault(); createArticle(); }}>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => fetchSuggestions('content')}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? 'Fetching AI Suggestion...' : 'Suggestion from AI'}
          </button>
        </div>

        {/* AI Content Suggestion */}
        {aiContentSuggestion && (
          <div className="mb-4 p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-semibold mb-2">AI Suggestion for Content</h3>
            <p>{aiContentSuggestion}</p>
            <button
              type="button"
              onClick={() => handleReplaceContent('content')}
              className="mt-2 ml-4 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700"
            >
              Replace with Suggestion
            </button>
          </div>
        )}

        {/* Summary */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => fetchSuggestions('summary')}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? 'Fetching AI Suggestion...' : 'Summary Suggestion from AI'}
          </button>
        </div>

        {/* AI Summary Suggestion */}
        {aiSummarySuggestion && (
          <div className="mb-4 p-4 border rounded-lg mt-4">
            <h3 className="text-xl font-semibold mb-2">AI Suggestion for Summary</h3>
            <p>{aiSummarySuggestion}</p>
            <button
              type="button"
              onClick={() => handleReplaceContent('summary')}
              className="mt-2 ml-4 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700"
            >
              Replace with Suggestion
            </button>
          </div>
        )}

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="images">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            accept="image/*"
            multiple
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
                                     {uploading ? 'Uploading...' : 'Upload Images'}

          </button>
        </div>
        {formData.images.length > 0 && ( // Change images to use formData.images
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className='flex flex-col items-center border border-gray-300 rounded-lg p-2'>
                                    <img
                                        src={url}
                                        alt='listing image'
                                        className='w-full h-32 object-cover rounded-lg mb-2'
                                    />
                                </div>
                            ))}
                        </div>
                    )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Create Article
        </button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
