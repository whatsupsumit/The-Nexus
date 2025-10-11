import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';

// Initialize Sentry (this will be called in index.js)
export const initSentry = () => {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }
};

// Logger class
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  // Info level logging
  info(message, ...args) {
    if (this.isDevelopment) {
      console.log(`[NEXUS INFO] ${message}`, ...args);
    } else {
      Sentry.captureMessage(message, 'info');
    }
  }

  // Warning level logging
  warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(`[NEXUS WARN] ${message}`, ...args);
    } else {
      Sentry.captureMessage(message, 'warning');
    }
  }

  // Error level logging
  error(message, error = null, showToast = false, ...args) {
    if (this.isDevelopment) {
      console.error(`[NEXUS ERROR] ${message}`, error, ...args);
    } else {
      if (error) {
        Sentry.captureException(error, {
          tags: { message },
          extra: { args }
        });
      } else {
        Sentry.captureMessage(message, 'error');
      }
    }

    // Show user-facing error toast if requested
    if (showToast) {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  // Debug logging (only in development)
  debug(message, ...args) {
    if (this.isDevelopment) {
      console.debug(`[NEXUS DEBUG] ${message}`, ...args);
    }
  }

  // API call logging
  apiCall(endpoint, method = 'GET', success = true, error = null) {
    const message = `API ${method} ${endpoint}: ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      this.info(message);
    } else {
      this.error(message, error);
    }
  }

  // Mobile-specific logging
  mobileEvent(event, data = {}) {
    this.info(`Mobile ${event}`, data);
  }
}

export const logger = new Logger();
export default logger;
