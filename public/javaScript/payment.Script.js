document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const packageName = params.get('package');
    const packagePrice = params.get('price');
    const userId = params.get('userId');
    const email = params.get('email'); // Added email from params
    const mobile = params.get('mobile'); // Added mobile from params

    if (!packageName || !packagePrice || !userId) {
        showMessageBox('Payment details missing. Redirecting to registration.');
        setTimeout(() => window.location.href = 'regrestation.html', 2000);
        return;
    }

    document.getElementById('packageName').textContent = packageName;
    document.getElementById('packagePrice').textContent = `₹ ${packagePrice}`;

    const payNowBtn = document.getElementById('payNowBtn');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');

    payNowBtn.addEventListener('click', async function() {
        payNowBtn.disabled = true;
        cancelPaymentBtn.disabled = true;
        payNowBtn.textContent = 'Processing Payment...';
        payNowBtn.classList.add('opacity-75', 'cursor-not-allowed');

        showMessageBox('Bhugtan prakriya jaari hai. Kripya intezaar karein...');

        // Simulate payment gateway processing
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3-second delay

        // Simulate payment success
        const paymentSuccess = true; // In a real scenario, this would come from the gateway callback

        if (paymentSuccess) {
            try {
                const db = window.firebaseDb;
                const updateDoc = window.updateDoc;
                const doc = window.doc;
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Re-get appId

                // Update payment status in Firestore
                // Ensure we use the userId passed from the registration page
                const userProfileDocRef = doc(db, `artifacts/${appId}/users/${userId}/registrations`, "profile");
                await updateDoc(userProfileDocRef, {
                    paymentStatus: 'completed',
                    paymentDate: new Date(),
                    packagePaid: packageName, // Confirm the package paid
                    amountPaid: parseInt(packagePrice), // Confirm the amount paid
                });

                showMessageBox('Bhugtan safal raha! Aapki sadasyata ab sakriya hai.');
                console.log('Payment successful and Firestore updated for user:', userId);

                // Redirect to a success page
                setTimeout(() => {
                    window.location.href = `success.html?userId=${userId}&package=${encodeURIComponent(packageName)}`;
                }, 2000);

            } catch (error) {
                console.error('Firestore update error after payment:', error);
                showMessageBox(`Bhugtan safal raha, lekin data update karne mein error: ${error.message}. Kripya support se sampark karein.`);
                payNowBtn.disabled = false;
                cancelPaymentBtn.disabled = false;
                payNowBtn.textContent = 'Pay Now (Simulated)';
                payNowBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        } else {
            showMessageBox('Bhugtan asafal raha. Kripya phir se koshish karein.');
            payNowBtn.disabled = false;
            cancelPaymentBtn.disabled = false;
            payNowBtn.textContent = 'Pay Now (Simulated)';
            payNowBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });

    cancelPaymentBtn.addEventListener('click', function() {
        showMessageBox('Bhugtan radd kiya gaya. Aapko registration page par wapas bheja ja raha hai.');
        setTimeout(() => window.location.href = 'regrestation.html', 2000);
    });
});