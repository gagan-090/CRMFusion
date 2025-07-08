// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA73-e5XjfqIA-k88rr-NzpQRH9OKBbN1I",
  authDomain: "easydail-6c6bf.firebaseapp.com",
  projectId: "easydail-6c6bf",
  storageBucket: "easydail-6c6bf.firebasestorage.app",
  messagingSenderId: "1007812144974",
  appId: "1:1007812144974:web:91b84608e8e5084478781f",
  measurementId: "G-V75657RWV9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
