import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6OFfu3HkN840XQSbPOy5Xa2jklBpD4cA",
  authDomain: "form-pendaftaran-7f219.firebaseapp.com",
  databaseURL: "https://form-pendaftaran-7f219-default-rtdb.firebaseio.com",
  projectId: "form-pendaftaran-7f219",
  storageBucket: "form-pendaftaran-7f219.firebasestorage.app",
  messagingSenderId: "405415625922",
  appId: "1:405415625922:web:a75248b9e8bfc00f20e75b"
};

const app = initializeApp(firebaseConfig);

// 🔥 INIT SETELAH APP
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };