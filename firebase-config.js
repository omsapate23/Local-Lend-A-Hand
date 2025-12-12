// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // IMPORT AUTH

const firebaseConfig = {
  apiKey: "AIzaSyBVH5SNEHymR8OcqI9V6uil2Uvwfd_8EC4",
  authDomain: "local-lend-a-hand.firebaseapp.com",
  projectId: "local-lend-a-hand",
  storageBucket: "local-lend-a-hand.appspot.com",
  messagingSenderId: "965476641285",
  appId: "1:965476641285:web:bd052de31d8b04202fca6c",
  measurementId: "G-TGPLEEDH5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // INITIALIZE AUTH

// Export both db and auth
export { db, auth };