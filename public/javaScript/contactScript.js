        // Function to display custom alert modal
        function showAlert(message) {
            document.getElementById('alertMessage').textContent = message;
            document.getElementById('customAlertModal').style.display = 'flex';
        }

        // Close custom alert modal
        document.getElementById('closeAlertButton').addEventListener('click', () => {
            document.getElementById('customAlertModal').style.display = 'none';
        });
        document.getElementById('okButton').addEventListener('click', () => {
            document.getElementById('customAlertModal').style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target == document.getElementById('customAlertModal')) {
                document.getElementById('customAlertModal').style.display = 'none';
            }
        });

        // Navbar Toggle for mobile
        document.getElementById('navbar-toggle').addEventListener('click', function() {
            const navbarMenu = document.getElementById('navbar-menu');
            navbarMenu.classList.toggle('active');
        });

        // Form Submission Handling (client-side only for this design focus)
        const contactForm = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            // Basic client-side validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !email || !subject || !message) {
                showAlert('Please fill in all required fields (Name, Email, Subject, Message).');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showAlert('Please enter a valid email address.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            submitButton.classList.add('opacity-70', 'cursor-not-allowed');

            // Simulate API call or form processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real application, you would send this data to your backend
            // For example, using fetch API to a Firebase Function, Formspree, etc.
            console.log('Form data submitted:', {
                name: name,
                email: email,
                phone: document.getElementById('phone').value.trim(),
                subject: subject,
                message: message
            });

            // On success
            contactForm.reset(); // Clear the form fields
            contactForm.classList.add('hidden'); // Hide the form
            successMessage.classList.remove('hidden'); // Show success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Re-enable button after a short delay (if user needs to submit again)
            setTimeout(() => {
                submitButton.textContent = 'Send Message';
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
                // Optionally, hide success message and show form again after some time
                // successMessage.classList.add('hidden');
                // contactForm.classList.remove('hidden');
            }, 3000); // Re-enable after 3 seconds for another submission

        });

        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();