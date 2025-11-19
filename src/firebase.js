import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// npm install dotenv - env가 정상 동작하지 않을 때 설치 필요함

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore 
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db, collection, getDocs, doc, addDoc, updateDoc, query, where };