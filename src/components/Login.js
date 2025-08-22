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

// Enhanced Login component with better responsiveness and animations
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleButtonClick = async () => {
    setIsLoading(true);
    
    // Validate the user credentials
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = !isSignInForm && nameRef.current ? nameRef.current.value : "";

    const message = checkValidatedata(email, password);
    setErrorMessage(message);

    if (message) {
      setIsLoading(false);
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
        
        // Provide user-friendly error messages
        let friendlyMessage = "";
        switch (errorCode) {
          case 'auth/email-already-in-use':
            friendlyMessage = "This email is already registered. Please sign in instead or use a different email.";
            // Auto-switch to sign-in mode for better UX
            setTimeout(() => {
              setIsSignInForm(true);
              setErrorMessage("Switched to Sign In - this email is already registered.");
            }, 2000);
            break;
          case 'auth/weak-password':
            friendlyMessage = "Password should be at least 6 characters long.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "Please enter a valid email address.";
            break;
          case 'auth/operation-not-allowed':
            friendlyMessage = "Email/password accounts are not enabled. Please contact support.";
            break;
          default:
            friendlyMessage = `Sign Up Failed: ${errorMessage}`;
        }
        
        setErrorMessage(friendlyMessage);
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
          
          // Provide user-friendly error messages
          let friendlyMessage = "";
          switch (errorCode) {
            case 'auth/user-not-found':
              friendlyMessage = "No account found with this email. Please sign up first.";
              break;
            case 'auth/wrong-password':
              friendlyMessage = "Incorrect password. Please try again.";
              break;
            case 'auth/invalid-email':
              friendlyMessage = "Please enter a valid email address.";
              break;
            case 'auth/too-many-requests':
              friendlyMessage = "Too many failed attempts. Please try again later.";
              break;
            case 'auth/user-disabled':
              friendlyMessage = "This account has been disabled. Please contact support.";
              break;
            case 'auth/invalid-credential':
              friendlyMessage = "Invalid email or password. Please check your credentials.";
              break;
            default:
              friendlyMessage = `Sign In Failed: ${errorMessage}`;
          }
          
          setErrorMessage(friendlyMessage);
        });
    }
    
    setIsLoading(false);
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null); // Clear error message when toggling form
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black font-['JetBrains_Mono',monospace] overflow-hidden">
      {/* Enhanced Background with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-full opacity-30 transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: "url('nexusbg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.7) contrast(1.2)",
          }}
        />
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 20, 35, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 20, 35, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      {/* Enhanced Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/20 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />

      {/* Ultra Responsive Main Content Area */}
      <div className="relative flex flex-col lg:flex-row min-h-screen z-20 pt-4 sm:pt-8 lg:pt-16 pb-8 sm:pb-16 lg:pb-0">
        {/* Left Side - Ultra Responsive Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-6 sm:py-12 lg:py-8">
          <div className="max-w-3xl mx-auto lg:mx-0 mt-4 sm:mt-8 lg:mt-0">
            {/* Ultra Responsive Main Headline */}
            <div className="mb-6 sm:mb-8 lg:mb-12 text-center lg:text-left">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 sm:mb-6 leading-tight tracking-wider animate-fade-in"
                  style={{
                    textShadow: "0 0 30px rgba(255, 20, 35, 0.5), 0 0 60px rgba(255, 20, 35, 0.3)"
                  }}>
                STREAM THE
                <span className="text-red-400 block mt-1 sm:mt-2 animate-fade-in-delayed">FUTURE</span>
              </h1>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 sm:mb-8 leading-relaxed animate-fade-in-delayed-2">
                Access unlimited movies and TV shows on demand
              </p>
            </div>

            {/* Ultra Responsive Feature Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ),
                  title: "Premium Content",
                  desc: "Latest blockbusters and trending series"
                },
                {
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  ),
                  title: "4K Streaming",
                  desc: "Ultra-high definition quality"
                },
                {
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "No Ads",
                  desc: "Uninterrupted viewing experience"
                },
                {
                  icon: (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "Multi-Device",
                  desc: "Watch anywhere, anytime"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-black/40 backdrop-blur-xl border border-red-900/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 hover:bg-black/60 hover:border-red-500/50 transition-all duration-300 group animate-fade-in-delayed-3"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600/20 rounded-full flex items-center justify-center group-hover:bg-red-600/30 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg">{feature.title}</h3>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Simplified Call to Action */}
            <div className="mb-6 text-center lg:text-left animate-fade-in-delayed-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Streaming servers online • Platform ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Ultra Responsive Login Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 mt-4 sm:mt-8 lg:mt-0">
          <div className="relative w-full max-w-xs sm:max-w-md mt-2 sm:mt-4 lg:mt-0">
            {/* Ultra Responsive Animated Background Elements */}
            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative bg-black/70 sm:bg-black/80 backdrop-blur-2xl p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-2xl border border-red-900/30 hover:border-red-500/50 transition-all duration-500 animate-fade-in-delayed-2"
            >
              {/* Ultra Responsive Header */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-red-500/25">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center tracking-wider mb-2 sm:mb-3">
                    {isSignInForm ? "SIGN IN" : "CREATE ACCOUNT"}
                  </h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent mb-3 sm:mb-4"></div>
                  <p className="text-gray-400 text-center text-xs sm:text-sm md:text-base">
                    {isSignInForm ? "Enter your credentials to continue" : "Join the streaming revolution"}
                  </p>
                </div>
              </div>

              {/* Ultra Responsive Form Fields */}
              <div className="relative z-10 flex flex-col gap-3 sm:gap-4 lg:gap-5">
                {!isSignInForm && (
                  <div className="relative group">
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-3 sm:p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-gray-700/50 focus:border-red-500/50 transition-all duration-300 text-sm sm:text-base group-hover:bg-gray-800/90"
                    />
                    <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                )}
                
                <div className="relative group">
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-3 sm:p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-gray-700/50 focus:border-red-500/50 transition-all duration-300 text-sm sm:text-base group-hover:bg-gray-800/90"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div className="relative group">
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 sm:p-4 bg-gray-900/90 backdrop-blur-sm rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-gray-700/50 focus:border-red-500/50 transition-all duration-300 text-sm sm:text-base group-hover:bg-gray-800/90"
                  />
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                {errorMessage && (
                  <div className="relative p-3 sm:p-4 bg-red-900/30 border border-red-500/50 rounded-lg sm:rounded-xl backdrop-blur-sm animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-400 text-xs sm:text-sm font-bold leading-tight">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Ultra Responsive Action Button */}
                <div className="relative mt-4 sm:mt-6">
                  <button
                    className="w-full p-3 sm:p-4 bg-red-600 hover:bg-red-700 rounded-lg sm:rounded-xl text-white font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    onClick={handleButtonClick}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="text-xs sm:text-sm lg:text-base">PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-xs sm:text-sm lg:text-base">{isSignInForm ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ultra Responsive Footer Options */}
              <div className="relative z-10 flex flex-col xs:flex-row justify-between items-center text-xs sm:text-sm mt-4 sm:mt-6 space-y-2 xs:space-y-0">
                <label className="flex items-center text-gray-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-3 w-3 sm:h-4 sm:w-4 text-red-600 rounded border-gray-600 focus:ring-red-500 mr-2 sm:mr-3 bg-gray-800 transition-colors duration-300"
                  />
                  <span className="group-hover:text-red-400 transition-colors duration-300">
                    <span className="hidden sm:inline">Remember me</span>
                    <span className="sm:hidden">Remember</span>
                  </span>
                </label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-400 bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                >
                  <span className="hidden sm:inline">Need Help?</span>
                  <span className="sm:hidden">Help?</span>
                </button>
              </div>

              {/* Sign Up Instructions */}
              {!isSignInForm && (
                <div className="relative z-10 mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs sm:text-sm text-blue-300">
                      <p className="font-medium mb-1">Demo Account Info:</p>
                      <p className="text-blue-200/80">
                        You can use any random email and password for testing. 
                        <span className="block sm:inline sm:ml-1">No real verification required!</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ultra Responsive Toggle Section */}
              <div className="relative z-10 mt-6 sm:mt-8 text-center">
                <div className="w-full h-px bg-gray-700/50 mb-4 sm:mb-6"></div>
                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <span className="hidden sm:inline">
                    {isSignInForm ? "Don't have an account?" : "Already have an account?"}
                  </span>
                  <span className="sm:hidden">
                    {isSignInForm ? "No account?" : "Have account?"}
                  </span>{" "}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 font-bold bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                    onClick={toggleSignInForm}
                  >
                    {isSignInForm ? "Sign Up" : "Sign In"}
                  </button>
                </p>
                <p className="text-xs text-gray-500 px-1 sm:px-2">
                  <span className="hidden sm:inline">Secure & encrypted with industry standards.</span>
                  <span className="sm:hidden">Secure & encrypted.</span>{" "}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                  >
                    <span className="hidden sm:inline">Privacy Policy</span>
                    <span className="sm:hidden">Privacy</span>
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Ultra Responsive Bottom Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-2 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xs sm:text-sm text-gray-400">
            <span className="hidden sm:inline">© 2025 NEXUS Streaming • Premium Entertainment Platform</span>
            <span className="sm:hidden">© 2025 NEXUS • Premium Streaming</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
