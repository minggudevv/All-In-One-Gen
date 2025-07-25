// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import getAnalytics conditionally
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD01Jum-DrQ5UKBhzE0QFWnO_q_7hMeTMU",
  authDomain: "all-in-one-gen.firebaseapp.com",
  projectId: "all-in-one-gen",
  storageBucket: "all-in-one-gen.firebasestorage.app",
  messagingSenderId: "303608771343",
  appId: "1:303608771343:web:1be5817b18d07ee6a5847a",
  measurementId: "G-YPQSMY1SRH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only in the browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };