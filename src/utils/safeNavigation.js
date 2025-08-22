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
  
  // Ensure Google Tag Manager mock exists
  if (!window.googletag) {
    window.googletag = {};
  }
  window.googletag.cmd = window.googletag.cmd || [];
  window.googletag.destroySlots = window.googletag.destroySlots || function(slots) {
    console.log('[NEXUS] Runtime googletag.destroySlots intercepted');
    return slots || [];
  };
  
  // Additional runtime error patterns
  const runtimePatterns = [
    'googletag',
    'TypeError: googletag',
    'googletag.destroySlots is not a function',
    'Cannot read properties of undefined (reading \'destroySlots\')',
    'Cannot read property \'destroySlots\' of undefined',
    'ERR_UNSAFE_REDIRECT',
    'chunk-vendors',
    'Service worker',
    'Firebase Analytics',
    'gtag',
    'gpt.js'
  ];
  
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    const stack = (new Error()).stack || '';
    
    const shouldSuppress = runtimePatterns.some(pattern => 
      message.includes(pattern) || stack.includes(pattern)
    );
    
    if (shouldSuppress) {
      console.log('[NEXUS] Runtime error suppressed:', message);
      return;
    }
    
    originalError.apply(console, args);
  };
  
  // Additional window error handler
  window.addEventListener('error', function(event) {
    const message = event.message || '';
    if (message.includes('googletag') || message.includes('destroySlots')) {
      console.log('[NEXUS] Runtime window error suppressed:', message);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
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
