// Import the necessary Firebase modules and your database configuration
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const createEventForm = document.getElementById('create-event-form');
    const currentEventsContainer = document.getElementById('current-events-container');

    // --- Function to Fetch and Display Current Events ---
    async function displayCurrentEvents() {
        // Clear the container to prevent duplicates on refresh
        currentEventsContainer.innerHTML = '';

        // Create a query to get all documents from the "opportunities" collection, sorted by date
        const q = query(collection(db, "opportunities"), orderBy("date", "asc"));

        try {
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                currentEventsContainer.innerHTML = '<p>No active events found. Add one using the form above!</p>';
                return;
            }

            // Loop through each event and display it in a simple list format
            querySnapshot.forEach(doc => {
                const event = doc.data();
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item'; // For potential future styling
                eventElement.innerHTML = `
                    <p><strong>${event.title}</strong> - ${event.date}</p>
                `;
                currentEventsContainer.appendChild(eventElement);
            });
        } catch (error) {
            console.error("Error fetching current events: ", error);
            currentEventsContainer.innerHTML = '<p>Could not load event data.</p>';
        }
    }

    // --- Form Submission Event Listener ---
    createEventForm.addEventListener('submit', async (e) => {
        // Prevent the default form submission which reloads the page
        e.preventDefault();

        // Get the values from the form inputs
        const title = document.getElementById('event-title').value;
        const organizer = document.getElementById('organizer-name').value;
        const date = document.getElementById('event-date').value;
        const location = document.getElementById('event-location').value;
        const description = document.getElementById('event-description').value;

        try {
            // Add a new document with the form data to the "opportunities" collection
            const docRef = await addDoc(collection(db, "opportunities"), {
                title: title,
                organizer: organizer,
                date: date,
                location: location,
                description: description,
                createdAt: serverTimestamp() // Adds a timestamp when the event is created
            });

            // Show a success message
            alert(`Success! Event "${title}" has been added.`);

            // Clear the form fields for the next entry
            createEventForm.reset();

            // Refresh the list of current events to show the new one instantly
            displayCurrentEvents();

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("There was an error submitting the event. Please try again.");
        }
    });

    // --- Initial Call ---
    // Load and display the current events as soon as the page is ready
    displayCurrentEvents();
});