import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXIeCXVVkkqQYXWwimNZZ_OAGooLuvcvs",
  authDomain: "moneymentor-b3d4e.firebaseapp.com",
  projectId: "moneymentor-b3d4e",
  storageBucket: "moneymentor-b3d4e.firebasestorage.app",
  messagingSenderId: "452478486182",
  appId: "1:452478486182:web:fc03be67627d8438819667",
  measurementId: "G-KQKZTPDN48",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
