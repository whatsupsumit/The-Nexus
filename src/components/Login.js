import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { checkValidatedata } from "../utils/validate";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Login component containing the Login form
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleButtonClick = async () => {
    // Made the function async
    // Validate the user credentials
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = !isSignInForm && nameRef.current ? nameRef.current.value : "";


    console.log("Email:", email);
    console.log("Password:", password);

    const message = checkValidatedata(email, password);
    setErrorMessage(message);

    if (message) {
      console.error("Validation error:", message);
      return; // Stop if validation fails
    }

    // Sign in and sign up logic
    if (!isSignInForm) {
      // Sign up logic
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Signed up successfully
        const user = userCredential.user;
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update Redux user state
        dispatch(addUser({
          uid: user.uid,
          email: user.email,
          displayName: name,
        }));
        setErrorMessage(null);
        navigate("/browse");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign up error:", errorCode, errorMessage);
        setErrorMessage(`Sign Up Failed: ${errorMessage} (${errorCode})`);
      }
    } else {
      // Sign in logic
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          // Update Redux user state
          dispatch(addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
          setErrorMessage(null);
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Sign In error:", errorCode, errorMessage);
          setErrorMessage(`Sign In Failed: ${errorMessage} (${errorCode})`);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null); // Clear error message when toggling form
  };

  return (
    <div className="relative min-h-screen w-full bg-nexus-gradient font-inter">
      {/* Simple Background Image */}
      <div
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: "url('nexusbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Simple Overlay */}
      <div className="absolute inset-0 w-full h-full bg-nexus-black/70" />

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-nexus-red rounded-lg flex items-center justify-center">
              <span className="text-nexus-text-light font-bold text-2xl">N</span>
            </div>
            <div className="font-['Arvo',serif] text-4xl font-bold text-nexus-red tracking-wider">
              NEXUS
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-nexus-text-dark">
            <span className="font-['Arvo',serif] text-sm">Quantum Streaming</span>
            <div className="w-1 h-1 bg-nexus-red rounded-full"></div>
            <span className="font-['Arvo',serif] text-sm">Neural Network</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex min-h-screen z-20">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl mt-24">
            {/* Main Headline */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-nexus-text-light mb-4 font-['Arvo',serif] leading-tight"
                  style={{
                    textShadow: "0 0 20px rgba(255, 20, 35, 0.5)"
                  }}>
                STREAM THE
                <span className="text-nexus-red block mt-4">FUTURE</span>
              </h1>
              <p className="text-xl md:text-2xl text-nexus-text-dark mb-6 font-['Arvo',serif] leading-relaxed">
                Access unlimited movies and TV shows through our quantum-powered neural streaming network
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-nexus-black/40 backdrop-blur-sm border border-nexus-red/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-nexus-red/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-nexus-red" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-nexus-text-light font-bold font-['Arvo',serif]">Premium Content</h3>
                </div>
                <p className="text-nexus-text-dark text-sm font-['Arvo',serif]">
                  Latest blockbusters and trending series
                </p>
              </div>

              <div className="bg-nexus-grey/40 backdrop-blur-sm border border-nexus-red/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-nexus-red/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-nexus-red" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="text-nexus-text-light font-bold font-['Arvo',serif]">4K Streaming</h3>
                </div>
                <p className="text-nexus-text-dark text-sm font-['Arvo',serif]">
                  Ultra-high definition quality
                </p>
              </div>

              <div className="bg-nexus-grey/40 backdrop-blur-sm border border-nexus-red/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-nexus-red/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-nexus-text-light font-bold font-['Arvo',serif]">No Ads</h3>
                </div>
                <p className="text-nexus-text-dark text-sm font-['Arvo',serif]">
                  Uninterrupted viewing experience
                </p>
              </div>

              <div className="bg-nexus-grey/40 backdrop-blur-sm border border-nexus-red/20 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-nexus-red/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-nexus-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-nexus-text-light font-bold font-['Arvo',serif]">Multi-Device</h3>
                </div>
                <p className="text-nexus-text-dark text-sm font-['Arvo',serif]">
                  Watch anywhere, anytime
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mb-8">
              <p className="text-lg text-nexus-text-dark font-['Arvo',serif] mb-4">
                Ready to enter the neural network?
              </p>
              <div className="flex items-center space-x-2 text-sm text-nexus-text-dark">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-['Arvo',serif]">Quantum servers online</span>
                <span className="text-nexus-grey">•</span>
                <span className="font-['Arvo',serif]">Neural interface ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6">
          {/* Simple Login Form */}
          <div className="relative w-full max-w-md">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative bg-nexus-dark/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-nexus-red/30"
            >

              {/* Simple Header */}
              <div className="relative z-10 mb-8">
                <h2 className="text-nexus-text-light text-3xl font-bold text-center font-['Arvo',serif] tracking-wider mb-2">
                  {isSignInForm ? "SIGN IN" : "CREATE ACCOUNT"}
                </h2>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-nexus-red to-transparent mb-4"></div>
                <p className="text-nexus-text-dark text-center font-['Arvo',serif] text-sm">
                  {isSignInForm ? "Enter your credentials to continue" : "Join the streaming platform"}
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-6">
                {!isSignInForm && (
                  <div className="relative">
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-4 bg-nexus-grey/90 backdrop-blur-sm rounded-lg text-nexus-text-light placeholder-nexus-text-dark focus:outline-none focus:ring-2 focus:ring-nexus-red/50 border border-nexus-red/20 font-['Arvo',serif] transition-all duration-300"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-4 bg-nexus-grey/90 backdrop-blur-sm rounded-lg text-nexus-text-light placeholder-nexus-text-dark focus:outline-none focus:ring-2 focus:ring-nexus-red/50 border border-nexus-red/20 font-['Arvo',serif] transition-all duration-300"
                  />
                </div>
                
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    className="w-full p-4 bg-nexus-grey/90 backdrop-blur-sm rounded-lg text-nexus-text-light placeholder-nexus-text-dark focus:outline-none focus:ring-2 focus:ring-nexus-red/50 border border-nexus-red/20 font-['Arvo',serif] transition-all duration-300"
                  />
                </div>
                
                {errorMessage && (
                  <div className="relative p-3 bg-nexus-red/20 border border-nexus-red/50 rounded-lg">
                    <p className="text-nexus-red-light text-sm font-['Arvo',serif] font-semibold">
                      ⚠ {errorMessage}
                    </p>
                  </div>
                )}
                
                {/* Simple Button */}
                <div className="relative mt-6">
                  <button
                    className="w-full p-4 bg-nexus-red hover:bg-nexus-red-light rounded-xl text-nexus-text-light font-bold text-lg font-['Arvo',serif] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleButtonClick}
                  >
                    {isSignInForm ? "SIGN IN" : "CREATE ACCOUNT"}
                  </button>
                </div>
              </div>

              {/* Simple Footer Options */}
              <div className="relative z-10 flex justify-between items-center text-sm mt-6">
                <label className="flex items-center text-nexus-text-dark cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-nexus-red rounded border-nexus-grey focus:ring-nexus-red mr-3 bg-nexus-grey"
                  />
                  <span className="font-['Arvo',serif] hover:text-nexus-red-light transition-colors duration-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-nexus-text-dark hover:text-nexus-red-light bg-transparent border-none p-0 cursor-pointer font-['Arvo',serif] transition-colors duration-300"
                >
                  Need Help?
                </button>
              </div>

              {/* Simple Toggle Section */}
              <div className="relative z-10 mt-8 text-center">
                <div className="w-full h-px bg-nexus-red/30 mb-6"></div>
                <p className="text-nexus-text-dark mb-4 font-['Arvo',serif]">
                  {isSignInForm ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="text-nexus-red hover:text-nexus-red-light font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                    onClick={toggleSignInForm}
                  >
                    {isSignInForm ? "Sign Up" : "Sign In"}
                  </button>
                </p>
                <p className="text-xs text-nexus-text-dark font-['Arvo',serif]">
                  Secure & encrypted with industry standards.{" "}
                  <button
                    type="button"
                    className="text-nexus-red hover:text-nexus-red-light bg-transparent border-none p-0 cursor-pointer transition-colors duration-300"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-nexus-text-dark">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-['Arvo',serif]">© 2025 NEXUS Streaming</span>
            <div className="w-1 h-1 bg-nexus-grey rounded-full"></div>
            <span className="font-['Arvo',serif]">Premium Entertainment Platform</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hover:text-nexus-red transition-colors duration-300 font-['Arvo',serif]">
              Privacy Matrix
            </button>
            <button className="hover:text-nexus-red transition-colors duration-300 font-['Arvo',serif]">
              Terms of Service
            </button>
            <button className="hover:text-nexus-red transition-colors duration-300 font-['Arvo',serif]">
              Help & Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
