// Utility functions for safe navigation and error handling
export const safeOpenExternal = (url, options = {}) => {
  try {
    // Validate URL
    const urlObj = new URL(url);
    const allowedHosts = ['www.youtube.com', 'youtube.com', 'youtu.be'];
    
    if (!allowedHosts.includes(urlObj.hostname)) {
      console.warn('Blocked unsafe external URL:', url);
      return false;
    }
    
    // Safe window opening
    const windowFeatures = 'noopener,noreferrer,width=1200,height=800';
    const newWindow = window.open(url, '_blank', windowFeatures);
    
    if (newWindow) {
      newWindow.opener = null;
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Failed to open external URL:', error);
    return false;
  }
};

export const safeNavigate = (path) => {
  try {
    // Validate internal path
    if (typeof path !== 'string' || !path.startsWith('/')) {
      console.warn('Invalid navigation path:', path);
      return false;
    }
    
    window.location.href = path;
    return true;
  } catch (error) {
    console.warn('Navigation failed, using fallback:', error);
    try {
      window.history.pushState({}, '', path);
      window.location.reload();
      return true;
    } catch (fallbackError) {
      console.error('All navigation methods failed:', fallbackError);
      return false;
    }
  }
};

// Enhanced error suppression for runtime
export const suppressRuntimeErrors = () => {
  if (typeof window === 'undefined') return;
  
  // Additional runtime error patterns
  const runtimePatterns = [
    'googletag',
    'TypeError: googletag',
    'ERR_UNSAFE_REDIRECT',
    'chunk-vendors',
    'Service worker'
  ];
  
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    const shouldSuppress = runtimePatterns.some(pattern => 
      message.includes(pattern)
    );
    
    if (shouldSuppress) {
      return;
    }
    
    originalError.apply(console, args);
  };
};

// Initialize on module load
if (typeof window !== 'undefined') {
  suppressRuntimeErrors();
}

const safeNavigationUtils = {
  safeOpenExternal,
  safeNavigate,
  suppressRuntimeErrors
};

export default safeNavigationUtils;
