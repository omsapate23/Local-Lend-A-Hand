// locallendahand.js - UPDATED WITH LOADING SCREEN

// Import the necessary Firebase modules
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Element Selections ---
    const tagTextContainer = document.querySelector('.tag-text');
    const getInvolvedBtn = document.querySelector('.tag-btn');
    const contactSection = document.querySelector('#contact');
    const serviceCards = document.querySelectorAll('.service-cards .card');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Select the Loading Screen
    const loadingScreen = document.getElementById('loading-screen');

    // --- 2. Loading Screen Functions ---
    function showLoading() {
        if(loadingScreen) loadingScreen.classList.remove('hidden');
    }

    function hideLoading() {
        if(loadingScreen) loadingScreen.classList.add('hidden');
    }

    // --- 3. Load and Display Events from FIREBASE ---
    async function loadAndDisplayEvents() {
        // Show loader before starting the fetch
        showLoading();

        try {
            // Create a query to get all documents from "opportunities"
            const q = query(collection(db, "opportunities"), orderBy("date", "asc"));
            const querySnapshot = await getDocs(q);

            // Create a container for the event listings
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-list';
            eventsContainer.innerHTML = '<h2>Upcoming Events (Select to Get Involved)</h2>';
            
            if (querySnapshot.empty) {
                 eventsContainer.innerHTML += '<p>No upcoming events found. Check back soon!</p>';
            }

            // Loop through each event and create a card
            querySnapshot.forEach(doc => {
                const event = doc.data();
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';

                eventCard.innerHTML = `
                    <div class="card-header">
                        <h4>${event.title}</h4>
                        <input type="checkbox" class="event-checkbox" value="${event.title}" title="Select this event">
                    </div>
                    <div class="card-body">
                        <p><strong>Organizer:</strong> ${event.organizer}</p>
                        <p><strong>Date:</strong> ${event.date}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p>${event.description}</p>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });

            // Insert the list before the "Get Involved" button
            tagTextContainer.insertBefore(eventsContainer, getInvolvedBtn);

        } catch (error) {
            console.error("Could not fetch events:", error);
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Could not load events at this time.';
            tagTextContainer.insertBefore(errorElement, getInvolvedBtn);
        } finally {
            // Hide loader when done (success or error)
            hideLoading();
        }
    }

    // Call the function immediately
    loadAndDisplayEvents();


    // --- 4. "Get Involved" Button Functionality ---
    if (getInvolvedBtn) {
        getInvolvedBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedCheckboxes = document.querySelectorAll('.event-checkbox:checked');

            if (selectedCheckboxes.length === 0) {
                alert('Please select at least one event to get involved in!');
                return;
            }
            const selectedEvents = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
            contactSection.scrollIntoView({ behavior: 'smooth' });
            createSignupForm(selectedEvents);
        });
    }

    // --- 5. Dynamically Create Sign-up Form ---
    function createSignupForm(selectedEvents) {
        const oldForm = document.getElementById('signup-form-container');
        if (oldForm) {
            oldForm.remove();
        }
        const formContainer = document.createElement('div');
        formContainer.id = 'signup-form-container';
        const eventsListItems = selectedEvents.map(eventTitle => `<li>${eventTitle}</li>`).join('');
        formContainer.innerHTML = `
            <h3>Sign Up for Events</h3>
            <p>You are signing up for:</p>
            <ul>${eventsListItems}</ul>
            <form id="signup-form">
                <input type="text" name="name" placeholder="Enter Your Name" required>
                <input type="email" name="email" placeholder="Enter Your Email" required>
                <button type="submit" class="tag-btn" style="background-color: #00796b; color: white;">Confirm & Sign Up</button>
            </form>
        `;
        contactSection.appendChild(formContainer);

        const signupForm = document.getElementById('signup-form');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // NOTE: Currently this form works instantly on the client side.
            // If you connect this to Firebase later to save volunteers, 
            // you would wrap that logic in showLoading() / hideLoading() too.
            
            const userName = signupForm.querySelector('input[name="name"]').value;
            alert(`Thank you, ${userName}! You've been signed up for the selected events. We'll be in touch soon.`);
            signupForm.reset();
            document.querySelectorAll('.event-checkbox:checked').forEach(box => box.checked = false);
        });
    }

    // --- 6. Hover Effects ---
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // --- 7. Smooth Scrolling ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const targetElement = document.querySelector(this.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});