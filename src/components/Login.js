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
    <div className="relative min-h-screen w-full bg-black font-inter overflow-hidden">
      {/* Enhanced Background Container */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('abs.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Animated Cyber Grid Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridFloat 15s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatParticle ${8 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
            }}
          />
        ))}
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/90 via-red-900/20 to-black/95 z-10" />
      
      {/* Matrix-style scan lines */}
      <div className="absolute inset-0 pointer-events-none z-15">
        <div 
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/60 to-transparent"
          style={{
            animation: 'scanLine 8s linear infinite',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
          }}
        />
      </div>

      {/* Enhanced Login Form Container */}
      <div className="relative flex items-center justify-center min-h-screen z-20 px-4 py-12">
        {/* Holographic Login Form */}
        <div className="relative w-full max-w-md group">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative bg-black/80 backdrop-blur-xl p-8 md:p-12 rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden"
          >
            {/* Neural Network Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.2) 0%, transparent 50%)`,
              }}
            ></div>

            {/* Animated Header */}
            <div className="relative z-10 mb-8">
              <h1 className="text-white text-4xl font-bold text-center font-['JetBrains_Mono',monospace] tracking-wider"
                  style={{
                    textShadow: "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
                  }}>
                {isSignInForm ? "NEURAL ACCESS" : "NEURAL REGISTRY"}
              </h1>
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent mt-4 animate-pulse"></div>
              <p className="text-gray-400 text-center mt-4 font-['JetBrains_Mono',monospace] text-sm">
                {isSignInForm ? "Initialize Connection Protocol" : "Register Neural Interface"}
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              {!isSignInForm && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-purple-500/50 rounded-lg blur opacity-30 group-focus-within:opacity-70 transition duration-300"></div>
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="Neural Identity"
                    className="relative w-full p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-red-500/20 font-['JetBrains_Mono',monospace] transition-all duration-300"
                  />
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-purple-500/50 rounded-lg blur opacity-30 group-focus-within:opacity-70 transition duration-300"></div>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="Neural Email Address"
                  className="relative w-full p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-red-500/20 font-['JetBrains_Mono',monospace] transition-all duration-300"
                />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/50 to-purple-500/50 rounded-lg blur opacity-30 group-focus-within:opacity-70 transition duration-300"></div>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Security Cipher"
                  className="relative w-full p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-red-500/20 font-['JetBrains_Mono',monospace] transition-all duration-300"
                />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {errorMessage && (
                <div className="relative p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm font-['JetBrains_Mono',monospace] font-semibold">
                    ⚠ {errorMessage}
                  </p>
                </div>
              )}
              
              {/* Enhanced Button */}
              <div className="relative group mt-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <button
                  className="relative w-full p-4 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold text-lg font-['JetBrains_Mono',monospace] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                  onClick={handleButtonClick}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative">
                    {isSignInForm ? "ESTABLISH CONNECTION" : "INITIALIZE REGISTRY"}
                  </span>
                </button>
              </div>
            </div>

            {/* Enhanced Footer Options */}
            <div className="relative z-10 flex justify-between items-center text-sm mt-6">
              <label className="flex items-center text-gray-400 group cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-red-500 rounded border-gray-600 focus:ring-red-500 mr-3 bg-gray-800"
                />
                <span className="font-['JetBrains_Mono',monospace] group-hover:text-red-400 transition-colors duration-300">
                  Maintain Session
                </span>
              </label>
              <button
                type="button"
                className="text-gray-400 hover:text-red-400 bg-transparent border-none p-0 cursor-pointer font-['JetBrains_Mono',monospace] transition-colors duration-300"
              >
                Neural Support
              </button>
            </div>

            {/* Enhanced Toggle Section */}
            <div className="relative z-10 mt-8 text-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-6"></div>
              <p className="text-gray-400 mb-4 font-['JetBrains_Mono',monospace]">
                {isSignInForm ? "New to the Neural Network?" : "Already registered?"}{" "}
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                  onClick={toggleSignInForm}
                >
                  {isSignInForm ? "Initialize Registry" : "Establish Connection"}
                </button>
              </p>
              <p className="text-xs text-gray-500 font-['JetBrains_Mono',monospace]">
                Protected by Quantum Encryption Protocol.{" "}
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 bg-transparent border-none p-0 cursor-pointer transition-colors duration-300"
                >
                  Learn more
                </button>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
