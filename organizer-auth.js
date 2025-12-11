// organizer-auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBox = document.getElementById('login-box');
const registerBox = document.getElementById('register-box');

// Toggle between Login and Register
document.getElementById('show-register').addEventListener('click', () => {
    loginBox.classList.add('hidden');
    registerBox.classList.remove('hidden');
});

document.getElementById('show-login').addEventListener('click', () => {
    registerBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
});

// --- REGISTER Logic ---
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const darpanId = document.getElementById('reg-darpan').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    // Simple Darpan ID format check (optional)
    if (!darpanId.includes('/')) {
        alert("Please enter a valid Darpan ID format (e.g., State/Year/Number)");
        return;
    }

    try {
        // 1. Create User in Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Store Extra Data (Darpan ID) in Firestore
        await setDoc(doc(db, "organizers", user.uid), {
            name: name,
            email: email,
            darpanId: darpanId,
            role: "admin"
        });

        alert("Registration Successful! Redirecting...");
        window.location.href = "organizer.html";

    } catch (error) {
        console.error("Error:", error);
        alert("Registration Failed: " + error.message);
    }
});

// --- LOGIN Logic ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Login success - Auth state listener will handle redirect
        alert("Login Successful");
        window.location.href = "organizer.html";
    } catch (error) {
        console.error("Login Error:", error);
        alert("Invalid Email or Password.");
    }
});