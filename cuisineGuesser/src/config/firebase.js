// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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