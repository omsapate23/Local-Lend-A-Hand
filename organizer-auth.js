// organizer-auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for the DOM to be fully loaded (Fixes the "can't interact" issue)
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Organizer Auth Script Loaded"); // Debugging check

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');

    // --- Toggle Logic ---
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents the page from jumping to top
            console.log("Switching to Register Mode");
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Switching to Login Mode");
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });
    }

    // --- REGISTER Logic ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const darpanId = document.getElementById('reg-darpan').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            if (!darpanId.includes('/')) {
                alert("Please enter a valid Darpan ID format (e.g., State/Year/Number)");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

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
    }

    // --- LOGIN Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login Successful");
                window.location.href = "organizer.html";
            } catch (error) {
                console.error("Login Error:", error);
                alert("Invalid Email or Password.");
            }
        });
    }
});