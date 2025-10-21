import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration is now correctly set up with your project credentials.
const firebaseConfig = {
  apiKey: "AIzaSyBiHev7Ka06Ay26rSR3EuotdMKWUlwwNXQ",
  authDomain: "studio-1981514099-ea697.firebaseapp.com",
  projectId: "studio-1981514099-ea697",
  storageBucket: "studio-1981514099-ea697.firebasestorage.app",
  messagingSenderId: "838434346245",
  appId: "1:838434346245:web:e2430c84ec0dcf8898136c",
  measurementId: "G-B1HYWZ6BK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
