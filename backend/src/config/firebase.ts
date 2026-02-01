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
    } else if (process.env.FIREBASE_PROJECT_ID) {
      // Initialize with environment variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      console.warn('Firebase not configured. Running in local mode.');
    }
  }
  return admin;
};

export const firebaseAdmin = initializeFirebase();
export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();

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
