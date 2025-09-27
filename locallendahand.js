// Wait for the entire HTML document to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const tagTextContainer = document.querySelector('.tag-text');
    const getInvolvedBtn = document.querySelector('.tag-btn');
    const contactSection = document.querySelector('#contact');
    const serviceCards = document.querySelectorAll('.service-cards .card');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // --- Main Function to Load and Display Events from JSON ---
    async function loadAndDisplayEvents() {
        try {
            // Fetch the data from your JSON file
            const response = await fetch('ngos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const events = await response.json();

            // Create a container for the event listings
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'events-list';
            eventsContainer.innerHTML = '<h2>Upcoming Events (Select to Get Involved)</h2>';

            // Loop through each event and create a styled card
            events.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';

                // *** THIS IS THE UPDATED HTML STRUCTURE FOR EACH CARD ***
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

            // Insert the entire list of events before the "Get Involved" button
            tagTextContainer.insertBefore(eventsContainer, getInvolvedBtn);

        } catch (error) {
            console.error("Could not fetch or display events:", error);
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Could not load events at this time.';
            tagTextContainer.insertBefore(errorElement, getInvolvedBtn);
        }
    }

    // Call the function to load events when the page loads
    loadAndDisplayEvents();


    // --- "Get Involved" Button Functionality ---
    getInvolvedBtn.addEventListener('click', (event) => {
        event.preventDefault();

        // Find all checkboxes that are currently checked
        const selectedCheckboxes = document.querySelectorAll('.event-checkbox:checked');

        // If no events are selected, alert the user and stop
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one event to get involved in!');
            return;
        }

        // Get the titles of the selected events
        const selectedEvents = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);

        // Smoothly scroll down to the contact section
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Create the signup form, passing the selected events
        createSignupForm(selectedEvents);
    });

    // --- Function to Dynamically Create the Sign-up Form ---
    function createSignupForm(selectedEvents) {
        // Remove any old form that might exist
        const oldForm = document.getElementById('signup-form-container');
        if (oldForm) {
            oldForm.remove();
        }

        const formContainer = document.createElement('div');
        formContainer.id = 'signup-form-container';

        // Create list items for each selected event
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

        // Add functionality to the newly created form
        const signupForm = document.getElementById('signup-form');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userName = signupForm.querySelector('input[name="name"]').value;
            alert(`Thank you, ${userName}! You've been signed up for the selected events. We'll be in touch soon.`);
            signupForm.reset();
            // Uncheck all boxes after successful signup
            document.querySelectorAll('.event-checkbox:checked').forEach(box => box.checked = false);
        });
    }

    // --- Add a subtle hover effect to service cards ---
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    // --- Smooth scrolling for all navigation links ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const targetElement = document.querySelector(this.hash);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});