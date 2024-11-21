import React, { useState } from 'react';
import { Menu, X, Search } from 'react-feather';
import { useSelector } from 'react-redux';
import { useNavigate} from "react-router-dom"
function Header() {
  const {currentUser}= useSelector((state)=>state.user)
  const [isOpen, setIsOpen] = useState(false);
  const navigate= useNavigate()

  const handleclick=()=>{
 navigate('/profile')
  }

  return (
    <header className="bg-gray-800 text-white fixed w-full shadow-lg z-10">
      <div className="container mx-auto flex justify-between items-center p-4">
        
        {/* Logo */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-gray-300">KnowledgeHub</a>
        </div>

        {/* Search Bar (Hidden on Mobile) */}
        {/* <div className="hidden md:flex items-center bg-gray-700 rounded-lg px-4 py-2 mx-4 w-1/2">
          <input
            type="text"
            placeholder="Search articles, topics, or questions..."
            className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
          />
          <button className="ml-2 text-gray-400 hover:text-white">
            <Search />
          </button>
        </div> */}

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <a href="/articles" className="hover:text-gray-400 transition duration-200">Articles</a>
          <a href="/questions" className="hover:text-gray-400 transition duration-200">Questions</a>
          <a href="/topics" className="hover:text-gray-400 transition duration-200">Topics</a>
          <a href="/authors" className="hover:text-gray-400 transition duration-200">Authors</a>
          <a href="/saved" className="hover:text-gray-400 transition duration-200">Saved</a>
          <a href="/about" className="hover:text-gray-400 transition duration-200">About</a>
        </nav>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Profile Dropdown */}
        <div className="hidden md:block relative ml-4">
          <button  onClick={handleclick}
           className="flex items-center space-x-2 hover:text-gray-400 transition duration-200">
            <img
             src={currentUser?.avatar || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <span className="font-semibold">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="absolute top-full left-0 w-full bg-gray-800 md:hidden flex flex-col items-center py-4 shadow-lg space-y-4">
          <a href="/articles" className="text-white hover:text-gray-400 transition duration-200">Articles</a>
          <a href="/questions" className="text-white hover:text-gray-400 transition duration-200">Questions</a>
          <a href="/topics" className="text-white hover:text-gray-400 transition duration-200">Topics</a>
          <a href="/authors" className="text-white hover:text-gray-400 transition duration-200">Authors</a>
          <a href="/saved" className="text-white hover:text-gray-400 transition duration-200">Saved</a>
          <a href="/about" className="text-white hover:text-gray-400 transition duration-200">About</a>
          <a href="/profile" className="text-white hover:text-gray-400 transition duration-200">Profile</a>
        </nav>
      )}
    </header>
  );
}

export default Header;
