document.addEventListener('DOMContentLoaded', () => {
    // Password toggle functionality
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
        } else {
            passwordField.type = 'password';
        }
    });

    // Form submission handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' // Important for cookies
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Redirect to dashboard on success
                window.location.href = result.redirect;
            } else {
                // Show error message
                showMessageBox(result.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessageBox('Network error. Please try again.');
        }
    });

    // Show message function
    function showMessageBox(message) {
        const messageBox = document.getElementById('messageBox');
        const messageText = document.getElementById('messageText');
        messageText.textContent = message;
        messageBox.style.display = 'block';
    }

    // Close message box
    document.querySelector('.message-box button').addEventListener('click', () => {
        document.getElementById('messageBox').style.display = 'none';
    });
});