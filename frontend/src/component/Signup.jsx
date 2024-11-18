import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { siginInStart, siginInSuccess, signinFailure } from '../Redux/user/userSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';

export default function Signup() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(siginInStart());
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(`Role:`,data.role); // This will show any extra spaces around the role

      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      dispatch(siginInSuccess(data));
      if (data.role === "admin") {
        navigate('/admindashboard'); 
      } else {
        navigate('/dashboard'); 
      }
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/users/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(siginInSuccess(data));
      navigate('/dashboard');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 sm:items-center">
      <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Signup</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 transition ease-in-out duration-200"
          >
            Signup
          </button>

          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">or signup with</span>
            <span className="w-1/5 border-b border-gray-300 lg:w-1/4"></span>
          </div>

          <button
            onClick={handleGoogleClick}
            type="button"
            className="w-full flex items-center justify-center py-3 mt-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-red-300 transition ease-in-out duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>

          <div className="mt-4 text-sm text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-bold transition duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
  );
}
