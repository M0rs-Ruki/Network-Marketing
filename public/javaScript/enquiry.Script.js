
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase Configuration (provided globally by the environment)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app, db, auth, userId;
let isAuthReady = false;

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


// Initialize Firebase and set up authentication
async function initializeFirebase() {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                document.getElementById('currentUserId').textContent = userId;
                document.getElementById('userIdDisplay').classList.remove('hidden');
            } else {
                // Sign in anonymously if no user is found
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            }
            isAuthReady = true; // Mark authentication as ready
        });
    } catch (error) {
        console.error("Error initializing Firebase or during authentication:", error);
        showAlert("Failed to initialize Firebase. Please try again later.");
    }
}

initializeFirebase();

// Navbar Toggle for mobile
document.getElementById('navbar-toggle').addEventListener('click', function() {
    const navbarMenu = document.getElementById('navbar-menu');
    navbarMenu.classList.toggle('active');
});

// Form Submission Handling
const form = document.getElementById('enquiryForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!isAuthReady) {
        showAlert("Firebase not ready. Please wait a moment and try again.");
        return;
    }
    if (!userId) {
        showAlert("User not authenticated. Please try refreshing the page.");
        return;
    }

    // Basic client-side validation
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const subject = document.getElementById('subject').value.trim();


    if (!fullName || !email || !message) {
        showAlert('Please fill in all required fields (Full Name, Email, Message).');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showAlert('Please enter a valid email address.');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('opacity-70', 'cursor-not-allowed');

    try {
        // Construct the data object for Firestore
        const enquiryData = {
            fullName: fullName,
            email: email,
            mobile: mobile,
            subject: subject,
            message: message,
            timestamp: new Date(),
            userId: userId // Store the user ID with the enquiry
        };

        // Add the document to a subcollection specific to the app and user
        // Path: /artifacts/{appId}/users/{userId}/enquiries
        const enquiriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/enquiries`);
        await addDoc(enquiriesCollectionRef, enquiryData);

        form.reset(); // Clear the form fields
        form.classList.add('hidden'); // Hide the form
        successMessage.classList.remove('hidden'); // Show success message
        // Scroll to the success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Error submitting enquiry to Firebase:', error);
        showAlert('An error occurred while submitting your enquiry. Please try again later.');
    } finally {
        // Re-enable button
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
    }
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Optional: Tawk.to Live Chat integration placeholder
// <!--Start of Tawk.to Script-->
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// (function(){
// var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
// s1.async=true;
// s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
// s1.charset='UTF-8';
// s1.setAttribute('crossorigin','*');
// s0.parentNode.insertBefore(s1,s0);
// })();
// <!--End of Tawk.to Script--></script>