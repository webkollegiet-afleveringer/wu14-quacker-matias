// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmD-VZ4_OXJWXPo2Js43hDfn1LHtlA4OQ",
  authDomain: "quacker-39d57.firebaseapp.com",
  projectId: "quacker-39d57",
  storageBucket: "quacker-39d57.firebasestorage.app",
  messagingSenderId: "316242520423",
  appId: "1:316242520423:web:21292df422aefd0f8927c2",
  measurementId: "G-0L699YFET8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics };