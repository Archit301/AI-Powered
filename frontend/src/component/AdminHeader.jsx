// src/components/AdminHeader.js

import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg rounded-b-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-blue-400 transition duration-200">
            Admin Dashboard
          </Link>
        </div>
        <nav className="flex space-x-8 text-lg">
          <Link to="/adminarticle" className="hover:text-blue-400 transition duration-200">
            Articles
          </Link>
          <Link to="/adminquestion" className="hover:text-blue-400 transition duration-200">
            Questions
          </Link>
          <Link to="/admin/reports" className="hover:text-blue-400 transition duration-200">
            Reports
          </Link>
          <Link to="/admin/profile" className="hover:text-blue-400 transition duration-200">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
