// Firebase app initialization - Firebase setup karne ke liye
import { initializeApp } from "firebase/app";
// Analytics disabled hai kyunki Google Tag Manager ke saath conflict ho raha tha
// import { getAnalytics, isSupported } from "firebase/analytics";
// Firebase authentication - login/signup features ke liye
import { getAuth } from "firebase/auth";

// Firebase configuration - app ke credentials (.env file se aa rahe security ke liye)
// Yeh settings batate hain ki Firebase project se kaise connect karna hai
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
  console.log('[NEXUS] Firebase Analytics disabled to prevent GTM conflicts');
} catch (error) {
  console.log('[NEXUS] Firebase Analytics error caught:', error);
}

export const auth = getAuth(app);
export { analytics };