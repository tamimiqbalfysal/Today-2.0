import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This will use the application's default credentials on App Hosting
try {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export const db = admin.firestore();
