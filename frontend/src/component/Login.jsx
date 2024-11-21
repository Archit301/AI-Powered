import React, { useState } from 'react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { siginInStart, siginInSuccess, signinFailure } from '../Redux/user/userSlice';
import { app } from '../firebase';

export default function Login() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const dispatch=useDispatch()
    const navigate=useNavigate()
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
      
        
     const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          const data = await res.json(); 
          console.log(data);
      
          if (data.success === false) {
            dispatch(signinFailure(data.message));
            return;
          }
        console.log(data)
          dispatch(siginInSuccess(data));
          if (data.role === "admin") {
            navigate('/admindashboard'); 
          } else {
            navigate('/'); 
          }
        } catch (error) {
        
          dispatch(signinFailure(error.message));
        }
      };

    const handleGoogleClick=async()=>{
        try {
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app)
            const result=await signInWithPopup(auth,provider)
    const res=await fetch('/api/users/google',{
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
    }
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
         <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
         </div>
      
         <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Enter your username"
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-4 transition duration-300"
            >
              Login
            </button>

            <div className="mt-6">
              <button 
                 onClick={handleGoogleClick}
                className="w-full flex items-center justify-center bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.35 11.1H12v2.75h5.35c-.25 1.4-.98 2.6-2.1 3.42v2.85h3.38c1.99-1.85 3.12-4.58 3.12-7.77 0-.64-.06-1.27-.18-1.88z"/>
                  <path d="M12 22c2.4 0 4.4-.8 5.88-2.17l-3.38-2.85C13.6 17.58 12.8 18 12 18c-3.07 0-5.67-2.07-6.6-4.87H2v3.04C3.5 19.75 7.5 22 12 22z"/>
                  <path d="M5.4 13.13C5.2 12.53 5 11.8 5 11c0-.8.2-1.53.4-2.13V5.8H2v3.04C3.33 10.6 6 13 12 13v-2.75H7.8"/>
                  <path d="M12 4c1.3 0 2.47.45 3.39 1.35L17.92 4c-1.48-1.41-3.48-2.25-5.92-2.25C7.5 1.75 3.5 4 2 7.07l3.4 2.58C7.33 6.07 9.93 4 12 4z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-600">Don't have an account?</p>
              <NavLink
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register
              </NavLink>
            </div>
         </form>
       </div>
       {/* {error && <p className='text-red-500 mt-5'>{error}</p>} */}
    </div>
  )
}

