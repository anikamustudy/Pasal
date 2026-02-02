import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load environment variables
dotenv.config();

// Firebase Admin Configuration
const initializeFirebase = () => {
  if (!admin.apps.length) {
    // For production, use service account file
    // For development, use environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (process.env.FIREBASE_PROJECT_ID && 
               process.env.FIREBASE_PROJECT_ID !== 'your-project-id' &&
               process.env.FIREBASE_PRIVATE_KEY && 
               process.env.FIREBASE_PRIVATE_KEY !== 'your-private-key') {
      // Initialize with environment variables (only if they are properly configured)
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      console.warn('⚠️  Firebase not configured. Running in development/demo mode.');
      console.warn('⚠️  Firebase features (auth, cloud storage) will not be available.');
      // Return a mock admin instance for development
      return null;
    }
  }
  return admin;
};

const firebaseInstance = initializeFirebase();
export const firebaseAdmin = firebaseInstance;
export const db = firebaseInstance ? firebaseInstance.firestore() : null;
export const auth = firebaseInstance ? firebaseInstance.auth() : null;

// App Configuration
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:19000'],
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
};

export default config;
