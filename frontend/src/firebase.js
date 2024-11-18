// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6eRxQcrJ7RZ9zHusSUuRzx7wpqROK-6M",
  authDomain: "boltit-6505a.firebaseapp.com",
  projectId: "boltit-6505a",
  storageBucket: "boltit-6505a.appspot.com",
  messagingSenderId: "561289867585",
  appId: "1:561289867585:web:5d31a7d28f69adbbac71c0",
  measurementId: "G-P43VKZFF6L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);