// src/components/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="container mx-auto py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Followers/Statistics */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Followers</h3>
            <p className="text-lg">Total Followers: <span className="font-semibold">250</span></p>
          </div>

          {/* Likes/Dislikes */}
          <div className="bg-gradient-to-br from-green-400 to-teal-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Likes & Dislikes</h3>
            <p className="text-lg">Total Likes: <span className="font-semibold">120</span></p>
            <p className="text-lg">Total Dislikes: <span className="font-semibold">30</span></p>
          </div>

          {/* Comments/Views */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-bold mb-4">Comments & Views</h3>
            <p className="text-lg">Total Comments: <span className="font-semibold">150</span></p>
            <p className="text-lg">Total Views: <span className="font-semibold">5000</span></p>
          </div>

          {/* Article Management */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Manage Articles</h3>
            <Link to="/admin/articles" className="text-blue-600 hover:text-blue-800 block mt-2">View Articles</Link>
            <Link to="/admin/articles/create" className="text-blue-600 hover:text-blue-800 block mt-2">Create New Article</Link>
          </div>

          {/* Question Management */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Manage Questions</h3>
            <Link to="/admin/questions" className="text-blue-600 hover:text-blue-800 block mt-2">View Questions</Link>
            <Link to="/admin/questions/create" className="text-blue-600 hover:text-blue-800 block mt-2">Create New Question</Link>
          </div>

          {/* Reports */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Reports</h3>
            <Link to="/admin/reports" className="text-red-600 hover:text-red-800 block mt-2">View and Resolve Reports</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
