/**
 * NEXUS Video Player Error Suppression Utility
 * Handles third-party video player console noise
 */

const SUPPRESSED_PATTERNS = [
  // Common VidSrc/JWPlayer errors that don't affect functionality
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
  'VM[0-9]+:',
  'at get (<anonymous>',
  'at abort-current-inline-script',
  'Uncaught ReferenceError:'
];

let originalConsoleError = null;
let originalConsoleWarn = null;

export const setupErrorSuppression = () => {
  if (originalConsoleError) return; // Already setup
  
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;
  
  console.error = (...args) => {
    const message = args.join(' ');
    
    if (shouldSuppressError(message)) {
      // Log as NEXUS internal message instead
      console.log(
        '%c[NEXUS]%c Video player operation', 
        'color: #ef4444; font-weight: bold; background: #1a1a1a; padding: 2px 6px; border-radius: 3px;', 
        'color: #888888; font-style: italic;'
      );
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    
    if (shouldSuppressError(message)) {
      return; // Silently suppress
    }
    
    originalConsoleWarn.apply(console, args);
  };
};

export const restoreConsole = () => {
  if (originalConsoleError) {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    originalConsoleError = null;
    originalConsoleWarn = null;
  }
};

const shouldSuppressError = (message) => {
  return SUPPRESSED_PATTERNS.some(pattern => {
    if (pattern.includes('[0-9]+')) {
      // Handle regex patterns
      const regex = new RegExp(pattern);
      return regex.test(message);
    }
    return message.includes(pattern);
  });
};

// Auto-setup on import
setupErrorSuppression();

const errorSuppressionUtils = {
  setupErrorSuppression,
  restoreConsole,
  shouldSuppressError
};

export default errorSuppressionUtils;
