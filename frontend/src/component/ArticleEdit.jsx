import React, { useState } from 'react';
import { app } from '../firebase'; // Import the Firebase storage instance
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ArticleEdit = ({ onSubmit }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    author: currentUser._id, // Set the author as the logged-in user
    tags: '',
    category: '',
    images: [], // Array of image URLs
  });

  const [files, setFiles] = useState([]); // Files to be uploaded
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [formError, setFormError] = useState('');

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

  // Handle form submission and upload images to Firebase
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

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
            images: prevState.images.concat(urls), // Corrected here
          }));
          setUploading(false);
        })
        .catch((err) => {
          setUploading(false);
          setImageUploadError('Image upload failed (2 mb max per image)');
        });
    } else {
      setUploading(false);
      setImageUploadError('You can only upload 6 images per listing');
    }
  };

  // Upload images to Firebase and return their URLs
  const uploadImagesToFirebase = async (files) => {
    const imageUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const url = await storeImage(file);
        imageUrls.push(url);
      } catch (error) {
        setImageUploadError('Image upload failed (max 2 MB per image).');
        console.error(error);
      }
    }
    return imageUrls;
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
      } }
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Article</h2>
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
            rows="6"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Summary */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="summary">
            Summary (optional)
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="An AI-generated summary can go here"
          />
        </div>

        {/* Author (Disabled) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="author">
            Author ID
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            disabled
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Author's user ID"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="tags">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags separated by commas"
          />
        </div>

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
            <option value="AI">AI</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            onChange={handleImageChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            disabled={uploading}
            type="button"
            onClick={handleSubmit}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-70"
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

        {imageUploadError && (
          <p className="text-red-600 text-sm mt-2">{imageUploadError}</p>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Article
          </button>
        </div>

        {formError && (
          <p className="text-red-600 text-sm mt-2">{formError}</p>
        )}
      </form>
    </div>
  );
};

export default ArticleEdit;
