import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBz0L4WQI8ekT5IMR_QR466gGnk0YLic8I",
  authDomain: "bpressure-monitor.firebaseapp.com",
  projectId: "bpressure-monitor",
  storageBucket: "bpressure-monitor.appspot.com",
  messagingSenderId: "995069908500",
  appId: "1:995069908500:web:6dbd0b31add16bc043f901"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, app, firestore, storage };