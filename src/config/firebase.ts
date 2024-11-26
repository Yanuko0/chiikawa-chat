import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4CicthOrZ6dmrgNV9v6OoqadTI4OgCxo",
  authDomain: "chat-app-db554.firebaseapp.com",
  projectId: "chat-app-db554",
  storageBucket: "chat-app-db554.firebasestorage.app",
  messagingSenderId: "32936266120",
  appId: "1:32936266120:web:32c3e651111cc28f66923d",
  measurementId: "G-4RQ48P6M6P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 