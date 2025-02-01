// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //   apiKey: "AIzaSyDDr6_KpPi5OfhpLETjdMRyjaNI_CZ_nEo",
  //   authDomain: "kuri-blog-crud.firebaseapp.com",
  //   databaseURL: "https://kuri-blog-crud-default-rtdb.firebaseio.com",
  //   projectId: "kuri-blog-crud",
  //   storageBucket: "kuri-blog-crud.firebasestorage.app",
  //   messagingSenderId: "578581586432",
  //   appId: "1:578581586432:web:10a6bbb67b0b0ed09daee5",
  //   measurementId: "G-5CYC77P510",

  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { app, analytics };
