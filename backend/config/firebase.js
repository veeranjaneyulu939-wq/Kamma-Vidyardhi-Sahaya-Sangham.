const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.warn('Firebase Service Account Key not found. Please place "firebase-service-account.json" in the backend directory.');
    // Initialize without credentials (will fail on DB access, but allows server to start)
    admin.initializeApp();
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = admin.firestore();

module.exports = { admin, db };
