// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBV2GJjbQVuFthQ_gzT5GjgfYQQs_KZnb0",
  authDomain: "voting-system-3ed7b.firebaseapp.com",
  projectId: "voting-system-3ed7b",
  storageBucket: "voting-system-3ed7b.firebasestorage.app",
  messagingSenderId: "38685415808",
  appId: "1:38685415808:web:fbc9265bc0332d5cb20965",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app); // Corrected initialization for auth
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firestore database instance and serverTimestamp function
export { db, storage, auth };
