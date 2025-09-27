// firebase-config.js (Corrected Version)

// 1. Import the necessary functions from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Your web app's Firebase configuration (This part was correct)
const firebaseConfig = {
  apiKey: "AIzaSyBVH5SNEHymR8OcqI9V6uil2Uvwfd_8EC4",
  authDomain: "local-lend-a-hand.firebaseapp.com",
  projectId: "local-lend-a-hand",
  storageBucket: "local-lend-a-hand.appspot.com",
  messagingSenderId: "965476641285",
  appId: "1:965476641285:web:bd052de31d8b04202fca6c",
  measurementId: "G-TGPLEEDH5P"
};

// 3. Initialize Firebase and get the Firestore database service
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Export the database connection so other files can use it
export { db };