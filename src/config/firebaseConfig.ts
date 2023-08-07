import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkTHOtlZ_9ZhenJfzfkLcyKNfgDVjib6A",
  authDomain: "stocker-f1189.firebaseapp.com",
  projectId: "stocker-f1189",
  storageBucket: "stocker-f1189.appspot.com",
  messagingSenderId: "111930389972",
  appId: "1:111930389972:web:b2727ba528065876dc5241",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
