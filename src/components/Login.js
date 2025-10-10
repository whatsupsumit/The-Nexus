import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { checkValidatedata } from "../utils/validate";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, LogIn, UserPlus, Sparkles, Shield, Zap, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from || '/browse';

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleButtonClick = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = !isSignInForm && nameRef.current ? nameRef.current.value : "";

    const message = checkValidatedata(email, password);
    setErrorMessage(message);

    if (message) {
      setIsLoading(false);
      return;
    }

    if (!isSignInForm) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(auth.currentUser, { displayName: name });
        
        dispatch(addUser({
          uid: user.uid,
          email: user.email,
          displayName: name,
        }));
        
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate(from, { replace: true }), 1500);
      } catch (error) {
        const errorCode = error.code;
        let friendlyMessage = "";
        
        switch (errorCode) {
          case 'auth/email-already-in-use':
            friendlyMessage = "This email is already registered. Please sign in instead.";
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
          default:
            friendlyMessage = `Sign Up Failed: ${error.message}`;
        }
        
        setErrorMessage(friendlyMessage);
      }
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }));
          
          setSuccessMessage("Signed in successfully! Redirecting...");
          setTimeout(() => navigate(from, { replace: true }), 1500);
        })
        .catch((error) => {
          const errorCode = error.code;
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
            case 'auth/invalid-credential':
              friendlyMessage = "Invalid email or password. Please check your credentials.";
              break;
            default:
              friendlyMessage = `Sign In Failed: ${error.message}`;
          }
          
          setErrorMessage(friendlyMessage);
        });
    }
    
    setIsLoading(false);
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black font-['JetBrains_Mono',monospace] overflow-hidden">
      {/* Enhanced Background */}
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
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/20 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      
      {/* Interactive cursor glow */}
      <div 
        className="absolute w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Main Content */}
      <div className="relative flex flex-col lg:flex-row h-full z-20 pt-16 sm:pt-20 md:pt-24 lg:pt-20 xl:pt-24">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6 overflow-y-auto">
          <div className="max-w-lg lg:max-w-xl mx-auto lg:mx-0 lg:mr-4">
            {/* Main Headline */}
            <div className="mb-3 sm:mb-4 lg:mb-6 text-center lg:text-left">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-4 leading-tight tracking-wider animate-fade-in"
                  style={{
                    textShadow: "0 0 30px rgba(255, 20, 35, 0.5), 0 0 60px rgba(255, 20, 35, 0.3)"
                  }}>
                STREAM THE
                <span className="text-red-400 block mt-1 animate-fade-in-delayed">FUTURE</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-2 sm:mb-4 leading-relaxed animate-fade-in-delayed-2">
                Access unlimited movies and TV shows on demand
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 lg:mb-6">
              {[
                {
                  Icon: Sparkles,
                  title: "Premium Content",
                  desc: "Latest blockbusters and trending series",
                  color: "from-red-500 to-orange-500"
                },
                {
                  Icon: Zap,
                  title: "4K Streaming",
                  desc: "Ultra-high definition quality",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  Icon: Shield,
                  title: "No Ads",
                  desc: "Uninterrupted viewing experience",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  Icon: Sparkles,
                  title: "Multi-Device",
                  desc: "Watch anywhere, anytime",
                  color: "from-blue-500 to-cyan-500"
                }
              ].map((feature, index) => {
                const { Icon, title, desc, color } = feature;
                return (
                  <div 
                    key={index}
                    className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-2 sm:p-3 lg:p-4 hover:bg-black/60 hover:border-white/20 transition-all duration-500 group overflow-hidden"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-xs sm:text-sm lg:text-base">{title}</h3>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mb-2 sm:mb-3 text-center lg:text-left animate-fade-in-delayed-4">
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-xs sm:text-sm text-gray-400">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Streaming servers online • Platform ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex items-start lg:items-center justify-center p-2 sm:p-4 md:p-4 lg:p-4 overflow-y-auto pt-4 sm:pt-6 lg:pt-8">
          <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:ml-4">
            {/* Animated Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-red-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse"></div>
            
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-3xl p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>

              {/* Header */}
              <div className="relative z-10 mb-4 sm:mb-6">
                <div className="text-center mb-3 sm:mb-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl rotate-6 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                      {isSignInForm ? (
                        <LogIn className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      ) : (
                        <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                      )}
                    </div>
                  </div>
                  <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center tracking-wider mb-2 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    {isSignInForm ? "Welcome Back" : "Get Started"}
                  </h2>
                  <div className="relative w-24 h-1 mx-auto mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-purple-400 to-red-400 rounded-full blur-sm" />
                  </div>
                  <p className="text-gray-400 text-center text-sm sm:text-base">
                    {isSignInForm ? "Enter your credentials to continue" : "Join the streaming revolution"}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                {!isSignInForm && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                      <User className={`w-5 h-5 transition-all duration-300 ${
                        focusedField === 'name' ? 'text-red-400 scale-110' : 'text-gray-500'
                      }`} />
                    </div>
                    <input
                      ref={nameRef}
                      type="text"
                      placeholder="Full Name"
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 backdrop-blur-sm rounded-xl text-white placeholder-gray-500 focus:outline-none border border-white/10 focus:border-red-500/50 hover:border-white/20 transition-all duration-300 text-sm sm:text-base"
                    />
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                      focusedField === 'name' ? 'opacity-100' : ''
                    }`}></div>
                  </div>
                )}
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                    <Mail className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === 'email' ? 'text-red-400 scale-110' : 'text-gray-500'
                    }`} />
                  </div>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Email Address"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 backdrop-blur-sm rounded-xl text-white placeholder-gray-500 focus:outline-none border border-white/10 focus:border-red-500/50 hover:border-white/20 transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                    focusedField === 'email' ? 'opacity-100' : ''
                  }`}></div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
                    <Lock className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === 'password' ? 'text-red-400 scale-110' : 'text-gray-500'
                    }`} />
                  </div>
                  <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/5 backdrop-blur-sm rounded-xl text-white placeholder-gray-500 focus:outline-none border border-white/10 focus:border-red-500/50 hover:border-white/20 transition-all duration-300 text-sm sm:text-base"
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${
                    focusedField === 'password' ? 'opacity-100' : ''
                  }`}></div>
                </div>
                
                {/* Password Requirements for Sign Up */}
                {!isSignInForm && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mb-2">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "8-32 characters",
                        "One number (0-9)",
                        "One lowercase (a-z)",
                        "One uppercase (A-Z)"
                      ].map((req, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-purple-400 rounded-full"></div>
                          <span className="text-gray-400 text-xs">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Success Message */}
                {successMessage && (
                  <div className="relative p-3 sm:p-4 bg-green-900/30 border border-green-500/50 rounded-xl backdrop-blur-sm animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <p className="text-green-400 text-xs sm:text-sm font-medium leading-tight">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {errorMessage && (
                  <div className="relative p-3 sm:p-4 bg-red-900/30 border border-red-500/50 rounded-xl backdrop-blur-sm animate-fade-in">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-red-400 text-xs sm:text-sm font-medium leading-tight">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Action Button */}
                <div className="relative mt-2">
                  <button
                    className="relative w-full p-3 sm:p-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 rounded-xl text-white font-bold text-sm sm:text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 overflow-hidden group"
                    onClick={handleButtonClick}
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        {isSignInForm ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        <span>{isSignInForm ? "SIGN IN" : "CREATE ACCOUNT"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Options */}
              <div className="relative z-10 flex flex-col xs:flex-row justify-between items-center text-xs mt-4 space-y-2 xs:space-y-0">
                <label className="flex items-center text-gray-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-red-600 rounded border-gray-600 focus:ring-red-500 mr-2 bg-gray-800 transition-colors duration-300"
                  />
                  <span className="group-hover:text-red-400 transition-colors duration-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-400 bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                >
                  Need Help?
                </button>
              </div>

              {/* Sign Up Info */}
              {!isSignInForm && (
                <div className="relative z-10 mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-xs text-blue-300">
                      <p className="font-medium mb-1">Demo Account Info:</p>
                      <p className="text-blue-200/80">
                        You can use any random email and password for testing. No real verification required!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle Section */}
              <div className="relative z-10 mt-4 sm:mt-6 text-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3"></div>
                <p className="text-gray-400 mb-2 text-xs sm:text-sm">
                  {isSignInForm ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 font-bold bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                    onClick={toggleSignInForm}
                  >
                    {isSignInForm ? "Sign Up" : "Sign In"}
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  Secure & encrypted.{" "}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 bg-transparent border-none p-0 cursor-pointer transition-colors duration-300 hover:underline"
                  >
                    Privacy
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-40 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-xs text-gray-400">
            © 2025 NEXUS • Premium Streaming
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
