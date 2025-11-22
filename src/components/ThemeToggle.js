// React import
import React from 'react';
// Redux - current theme access aur toggle karne ke liye
import { useSelector, useDispatch } from 'react-redux';
// Redux action - theme switch karne ke liye
import { toggleTheme } from '../utils/themeSlice';
// Lucide icons - sun aur moon icons (light/dark mode ke liye)
import { Sun, Moon } from 'lucide-react';

// ThemeToggle component - dark/light mode switch button (animated icon ke saath)
const ThemeToggle = () => {
  const theme = useSelector(state => state.theme.mode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group bg-theme-card hover:bg-theme-card-hover border border-theme"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container */}
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun icon */}
        <Sun 
          className={`absolute inset-0 w-5 h-5 text-red-400 transition-all duration-500 transform ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-180 scale-75 opacity-0'
          }`}
        />
        
        {/* Moon icon */}
        <Moon 
          className={`absolute inset-0 w-5 h-5 text-red-500 transition-all duration-500 transform ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-180 scale-75 opacity-0'
          }`}
        />
      </div>
      
      {/* Animated ring */}
      <div className={`absolute inset-0 rounded-lg border-2 transition-all duration-300 ${
        theme === 'dark' 
          ? 'border-red-500/30 group-hover:border-red-500/60' 
          : 'border-red-400/30 group-hover:border-red-400/60'
      }`}></div>
      
      {/* Pulse effect on hover */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        theme === 'dark' 
          ? 'group-hover:shadow-lg group-hover:shadow-red-500/25' 
          : 'group-hover:shadow-lg group-hover:shadow-red-400/25'
      }`}></div>
    </button>
  );
};

export default ThemeToggle;