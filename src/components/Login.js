import React, { useState } from 'react';
import Header from './header';
// Login component containing the Login form
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div className="relative min-h-screen w-full bg-black font-inter">
      {/* Header component is assumed to be imported and used here */}
       <Header />
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('abs.jpg')", // Netflix-like background
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Creative Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black via-black/10 to-black/90 z-10" />

      {/* Login Form Container - Centered */}
      <div className="relative flex items-center justify-center min-h-screen z-20 px-4 py-12">
        <form
          className="w-full max-w-md bg-grey-900 p-8 md:p-12 rounded-lg shadow-2xl bg-opacity-75"
          onSubmit={(e) => e.preventDefault()}
        >
          <h1 className="text-white text-4xl font-bold mb-8 text-left">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          <div className="flex flex-col gap-4">
            {!isSignInForm && ( // Conditionally render Name input for Sign Up form
              <input
                type='text'
                placeholder='Full Name'
                className='p-4 bg-gray-700/80 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition'
              />
            )}
            <input
              type='email'
              placeholder='Email or phone number'
              className='p-4 bg-gray-700/80 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition'
            />
            <input
              type='password'
              placeholder='Password'
              className='p-4 bg-gray-700/80 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition'
            />
            <button className='p-4 mt-6 bg-red-600 hover:bg-red-700 rounded-md text-white font-bold text-lg transition-all duration-300 transform hover:scale-105'>
              {isSignInForm ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm mt-4">
            <label className="flex items-center text-gray-400">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-gray-400 rounded border-gray-600 focus:ring-red-600 mr-2 bg-gray-600" />
              Remember me
            </label>
            <button type="button" className="text-gray-400 hover:underline bg-transparent border-none p-0 cursor-pointer">Need help?</button>
          </div>

          <div className="mt-12 text-gray-400">
            <p className="mb-2">
              {isSignInForm ? "New to Nexus?" : "Already a user?"}{' '}
              <button
                type="button"
                className="text-white hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
                onClick={toggleSignInForm}
              >
                {isSignInForm ? "Sign up now." : "Sign in."}
              </button>
              .
            </p>
            <p className="text-xs">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <button type="button" className="text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer">Learn more</button>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
