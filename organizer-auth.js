// organizer-auth.js - UPDATED WITH LOADING SCREEN

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Organizer Auth Script Loaded"); 

    // --- 1. SELECT ELEMENTS ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    
    // Select the Loading Screen (Make sure you added the HTML for this!)
    const loadingScreen = document.getElementById('loading-screen'); 

    // --- 2. LOADING SCREEN FUNCTIONS ---
    function showLoading() {
        if(loadingScreen) loadingScreen.classList.remove('hidden');
    }

    function hideLoading() {
        if(loadingScreen) loadingScreen.classList.add('hidden');
    }

    // --- 3. TOGGLE BETWEEN LOGIN & REGISTER ---
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });
    }

    // --- 4. REGISTER LISTENER (Updated) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop page reload

            // Get form values
            const name = document.getElementById('reg-name').value;
            const darpanId = document.getElementById('reg-darpan').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            // Simple validation
            if (!darpanId.includes('/')) {
                alert("Please enter a valid Darpan ID format (e.g., State/Year/Number)");
                return;
            }

            // SHOW LOADING SCREEN
            showLoading();

            try {
                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save extra details in Firestore Database
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
            } finally {
                // HIDE LOADING SCREEN (Run this whether it succeeds or fails)
                hideLoading(); 
            }
        });
    }

    // --- 5. LOGIN LISTENER (Updated) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // SHOW LOADING SCREEN
            showLoading();

            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login Successful");
                window.location.href = "organizer.html";
            } catch (error) {
                console.error("Login Error:", error);
                alert("Invalid Email or Password.");
            } finally {
                // HIDE LOADING SCREEN
                hideLoading();
            }
        });
    }
});