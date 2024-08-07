// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore' 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLgKa5rR0J3OjuM4t1jx4nZLpnDo1cCKw",
  authDomain: "pantry-tracker-e2f61.firebaseapp.com",
  projectId: "pantry-tracker-e2f61",
  storageBucket: "pantry-tracker-e2f61.appspot.com",
  messagingSenderId: "530598571315",
  appId: "1:530598571315:web:041f37f45e66f21ab6e246",
  measurementId: "G-SR63NVDE9Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}