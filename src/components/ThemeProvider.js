// React aur useEffect hook - side effects handle karne ke liye
import React, { useEffect } from 'react';
// Redux - theme state access aur update karne ke liye
import { useSelector, useDispatch } from 'react-redux';
// Redux action - theme change karne ke liye
import { setTheme } from '../utils/themeSlice';

// ThemeProvider component - pura app ko theme (dark/light) apply karta hai
const ThemeProvider = ({ children }) => {
  const theme = useSelector(state => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load theme from localStorage on initial load
    const savedTheme = localStorage.getItem('nexus-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document root and body
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    body.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('nexus-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#090a0a' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === 'dark' ? '#090a0a' : '#ffffff';
      document.head.appendChild(meta);
    }
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;