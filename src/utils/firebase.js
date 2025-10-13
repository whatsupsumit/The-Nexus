import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics"; // Disabled to prevent GTM conflicts
import { getAuth } from "firebase/auth";
import { logger } from './logger.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Using environment variables for Firebase configuration for security
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics with error handling and Google Tag Manager compatibility
let analytics = null;

// Analytics disabled to prevent Google Tag Manager conflicts and related errors
// Firebase Analytics was causing googletag.destroySlots errors and ERR_UNSAFE_REDIRECT issues
try {
  logger.info('Firebase Analytics disabled to prevent GTM conflicts');
} catch (error) {
  logger.info('Firebase Analytics error caught:', error);
}

export const auth = getAuth(app);
export { analytics };