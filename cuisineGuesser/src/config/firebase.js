// Import functions from SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore"

//web Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtYV-KWqwX3fe13Ql1wMCa4hEtTuvbEtY",
  authDomain: "guessthecu.firebaseapp.com",
  projectId: "guessthecu",
  storageBucket: "guessthecu.firebasestorage.app",
  messagingSenderId: "206383116195",
  appId: "1:206383116195:web:dd348b4b28fc8ce2a27416",
  measurementId: "G-LSY8P2DPN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);