// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-ZV6AEN74WyIJn7l18UaTsYWrkHGL3CY",
  authDomain: "unmg-9b405.firebaseapp.com",
  projectId: "unmg-9b405",
  storageBucket: "unmg-9b405.firebasestorage.app",
  messagingSenderId: "396064219076",
  appId: "1:396064219076:web:d93c7dd5a9350902c24e91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);