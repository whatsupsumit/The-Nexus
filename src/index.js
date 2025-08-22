import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global error suppression for third-party video player errors
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// List of known video player error patterns to suppress
const suppressedErrorPatterns = [
  'ReferenceError: iwpzn8',
  'ReferenceError: cqwo4j', 
  'ReferenceError: n7fhfw',
  'ReferenceError: aclib',
  'ReferenceError: fabuak',
  'ReferenceError: hioszq',
  'ReferenceError: ebflxe',
  'aclib is not defined',
  'jwplayer',
  'abort-current-inline-script',
  'autoPlay=true&poster=false',
  // Google Tag Manager and Firebase Analytics related errors
  'googletag.destroySlots is not a function',
  'googletag',
  'GTM-',
  'googletagmanager',
  'Firebase Analytics',
  'ERR_UNSAFE_REDIRECT'
];

console.error = (...args) => {
  const message = args.join(' ');
  
  // Check if this is a suppressed error
  const shouldSuppress = suppressedErrorPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  if (shouldSuppress) {
    // Log to NEXUS internal logging instead
    console.log('%c[NEXUS SYSTEM]%c Third-party service internal operation - no action required', 
      'color: #ef4444; font-weight: bold;', 
      'color: #888888;'
    );
    return;
  }
  
  // Allow other errors through
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  const message = args.join(' ');
  
  const shouldSuppress = suppressedErrorPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  if (shouldSuppress) {
    return; // Suppress video player warnings
  }
  
  originalConsoleWarn.apply(console, args);
};

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.toString() || '';
  
  const shouldSuppress = suppressedErrorPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  if (shouldSuppress) {
    event.preventDefault(); // Prevent the error from being logged
    return;
  }
});

// Global error handler for runtime errors
window.addEventListener('error', (event) => {
  const message = event.message || '';
  
  const shouldSuppress = suppressedErrorPatterns.some(pattern => 
    message.includes(pattern)
  );
  
  if (shouldSuppress) {
    event.preventDefault(); // Prevent the error from being logged
    return;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
