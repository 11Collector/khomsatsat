// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvWxJGob-m2OAvAltUOQdFdMlJjp0XNAo",
  authDomain: "khomsatsat.firebaseapp.com",
  projectId: "khomsatsat",
  storageBucket: "khomsatsat.firebasestorage.app",
  messagingSenderId: "164591475147",
  appId: "1:164591475147:web:6234204823395c0c28fe4e",
  measurementId: "G-97SM4V1YLR"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);