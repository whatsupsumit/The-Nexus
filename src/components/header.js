import React, { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(store => store.user.name);

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('nexus_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Listen for profile image changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedImage = localStorage.getItem('nexus_profile_image');
      setProfileImage(savedImage);
    };

    // Check for image updates when location changes
    const savedImage = localStorage.getItem('nexus_profile_image');
    setProfileImage(savedImage);

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.error("Sign out error:", error);
        navigate("/error");
      });
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 z-50 bg-black/95 border-b border-red-800/30">

      {/* Logo */}
      <div
        className="font-['Arvo',serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 tracking-wider cursor-pointer hover:text-red-400 z-10"
        onClick={() => handleNavigation(user ? "/browse" : "/")}
      >
        NEXUS
      </div>

      {/* Desktop Navigation Menu */}
      {user && (
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 z-10">
          <button
            onClick={() => handleNavigation("/browse")}
            className={`relative font-['Arvo',serif] hover:text-nexus-red-light transition-all duration-300 font-medium group text-sm lg:text-base ${
              isActive("/browse") ? "text-nexus-red-light" : "text-nexus-text"
            }`}
          >
            <span className="relative z-10">HOME</span>
            <div className="absolute inset-0 bg-nexus-red/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {isActive("/browse") && (
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-400" />
            )}
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-nexus-red group-hover:w-full transition-all duration-300"></div>
          </button>
          
          <button
            onClick={() => handleNavigation("/movies")}
            className={`relative font-['Arvo',serif] hover:text-nexus-red-light transition-all duration-300 font-medium group text-sm lg:text-base ${
              isActive("/movies") ? "text-nexus-red-light" : "text-nexus-text"
            }`}
          >
            <span className="relative z-10">MOVIES</span>
            <div className="absolute inset-0 bg-nexus-red/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {isActive("/movies") && (
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-400" />
            )}
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-nexus-red group-hover:w-full transition-all duration-300"></div>
          </button>
          
          <button
            onClick={() => handleNavigation("/tv-shows")}
            className={`relative font-['Arvo',serif] hover:text-nexus-red-light transition-all duration-300 font-medium group text-sm lg:text-base ${
              isActive("/tv-shows") ? "text-nexus-red-light" : "text-nexus-text"
            }`}
          >
            <span className="relative z-10">SERIES</span>
            <div className="absolute inset-0 bg-nexus-red/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {isActive("/tv-shows") && (
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-400" />
            )}
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-nexus-red group-hover:w-full transition-all duration-300"></div>
          </button>
          
          <button
            onClick={() => handleNavigation("/vault")}
            className={`relative font-['Arvo',serif] hover:text-nexus-red-light transition-all duration-300 font-medium group text-sm lg:text-base ${
              isActive("/vault") || isActive("/my-list") ? "text-nexus-red-light" : "text-nexus-text"
            }`}
          >
            <span className="relative z-10">VAULT</span>
            <div className="absolute inset-0 bg-nexus-red/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {(isActive("/vault") || isActive("/my-list")) && (
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-red-400" />
            )}
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-nexus-red group-hover:w-full transition-all duration-300"></div>
          </button>

          {/* AI Chat Tab - Hidden on smaller screens */}
          <button
            onClick={() => handleNavigation("/neural-chat")}
            className={`relative font-['Arvo',serif] hover:text-cyan-400 transition-all duration-300 font-medium items-center space-x-2 group text-sm lg:text-base hidden lg:flex ${
              isActive("/neural-chat") ? "text-cyan-400" : "text-nexus-text"
            }`}
          >
            <div className="relative">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-spin transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div className="absolute -inset-1 bg-cyan-400/20 rounded-full blur group-hover:animate-pulse"></div>
            </div>
            <span className="relative z-10 hidden xl:inline">NEURAL AI</span>
            <span className="relative z-10 xl:hidden">AI</span>
            <div className="absolute inset-0 bg-cyan-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {isActive("/neural-chat") && (
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-400" />
            )}
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></div>
          </button>
        </nav>
      )}

      {/* Mobile Menu Button */}
      {user && (
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 text-nexus-text hover:text-nexus-red transition-colors duration-300 z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Profile Section */}
      <div className="flex items-center space-x-2 sm:space-x-4 z-10">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Responsive Profile Icon */}
            <button
              className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-nexus-red via-nexus-red-dark to-nexus-red-dark hover:from-nexus-red-light hover:via-nexus-red hover:to-nexus-red-dark transition-all duration-500 transform hover:scale-110 border-2 border-nexus-red/50 shadow-xl shadow-nexus-red/40 group overflow-hidden"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Profile"
            >
              {/* Animated Holographic Overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Matrix Grid Pattern */}
              <div 
                className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: '8px 8px'
                }}
              ></div>
              
              {/* User Icon or Profile Image */}
              <div className="relative z-20 flex items-center justify-center w-full h-full overflow-hidden">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              
              {/* Rotating Ring */}
              <div className="absolute inset-0 rounded-full border border-nexus-red-light/30 group-hover:animate-spin transition-all duration-1000"></div>
              
              {/* Pulse indicators */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-nexus-black"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full"></div>
              
              {/* Scan Line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-nexus-text-light to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
            </button>

            {/* Responsive Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-nexus-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-nexus-red/40 animate-fade-in z-50 overflow-hidden">
                {/* Glowing Header */}
                <div className="relative px-6 py-4 border-b border-nexus-red/30 bg-gradient-to-r from-nexus-red/20 to-purple-900/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-nexus-red/10 to-transparent"></div>
                  <p className="relative font-['Arvo',serif] text-nexus-text-light text-sm font-bold">
                    {user.displayName || user.email || "Neural User"}
                  </p>
                  <p className="relative font-['Arvo',serif] text-nexus-text-dark text-xs mt-1">
                    {user.email}
                  </p>
                  <div className="absolute top-0 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="py-2">
                  <button
                    className="group relative block w-full text-left px-6 py-3 font-['Arvo',serif] text-nexus-text hover:bg-nexus-red/20 hover:text-nexus-red-light transition-all duration-300 overflow-hidden"
                    onClick={() => handleNavigation("/profile")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-nexus-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <svg className="w-4 h-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile Matrix</span>
                      <div className="ml-auto w-1 h-1 bg-nexus-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                  
                  <button
                    className="group relative block w-full text-left px-6 py-3 font-['Arvo',serif] text-nexus-text hover:bg-nexus-red/20 hover:text-nexus-red-light transition-all duration-300 overflow-hidden"
                    onClick={() => handleNavigation("/account")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-nexus-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <svg className="w-4 h-4 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>System Settings</span>
                      <div className="ml-auto w-1 h-1 bg-nexus-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                </div>
                
                <div className="border-t border-nexus-red/30 bg-gradient-to-r from-nexus-red/10 to-transparent">
                  <button
                    onClick={handleSignOut}
                    className="group relative block w-full text-left px-6 py-3 font-['Arvo',serif] text-nexus-text hover:bg-nexus-red/30 hover:text-nexus-red-light transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-nexus-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Disconnect Neural Link</span>
                      <div className="ml-auto w-1 h-1 bg-nexus-red rounded-full animate-pulse"></div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          location.pathname !== "/" && (
            <button
              onClick={() => handleNavigation("/")}
              className="relative font-['Arvo',serif] text-nexus-text hover:text-nexus-red-light transition-all duration-500 font-medium px-6 py-2 border border-nexus-red/40 rounded-lg hover:border-nexus-red hover:shadow-lg hover:shadow-nexus-red/25 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-nexus-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Neural Access</span>
            </button>
          )
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {user && mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="absolute top-full left-0 right-0 bg-nexus-dark/95 backdrop-blur-xl border-b border-nexus-red/30 md:hidden z-40"
        >
          <nav className="flex flex-col py-4">
            <button
              onClick={() => {
                handleNavigation("/browse");
                setMobileMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-['Arvo',serif] transition-all duration-300 ${
                isActive("/browse") ? "text-nexus-red-light bg-nexus-red/10" : "text-nexus-text hover:text-nexus-red-light hover:bg-nexus-red/5"
              }`}
            >
              HOME
            </button>
            
            <button
              onClick={() => {
                handleNavigation("/movies");
                setMobileMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-['Arvo',serif] transition-all duration-300 ${
                isActive("/movies") ? "text-nexus-red-light bg-nexus-red/10" : "text-nexus-text hover:text-nexus-red-light hover:bg-nexus-red/5"
              }`}
            >
              MOVIES
            </button>
            
            <button
              onClick={() => {
                handleNavigation("/tv-shows");
                setMobileMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-['Arvo',serif] transition-all duration-300 ${
                isActive("/tv-shows") ? "text-nexus-red-light bg-nexus-red/10" : "text-nexus-text hover:text-nexus-red-light hover:bg-nexus-red/5"
              }`}
            >
              SERIES
            </button>
            
            <button
              onClick={() => {
                handleNavigation("/vault");
                setMobileMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-['Arvo',serif] transition-all duration-300 ${
                isActive("/vault") || isActive("/my-list") ? "text-nexus-red-light bg-nexus-red/10" : "text-nexus-text hover:text-nexus-red-light hover:bg-nexus-red/5"
              }`}
            >
              VAULT
            </button>
            
            <button
              onClick={() => {
                handleNavigation("/neural-chat");
                setMobileMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-['Arvo',serif] transition-all duration-300 flex items-center space-x-2 ${
                isActive("/neural-chat") ? "text-cyan-400 bg-cyan-400/10" : "text-nexus-text hover:text-cyan-400 hover:bg-cyan-400/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>NEURAL AI</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;