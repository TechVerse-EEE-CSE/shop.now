import { auth } from './firebase-init.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

window.openAuthModal = function () {
    if (window.__currentUser) {
        signOut(auth).then(() => showToast("Logout successful"));
        return;
    }
    document.getElementById('auth-overlay').classList.add('active');
    document.getElementById('auth-sheet').classList.add('active');
    toggleEmailMode('login');
};

window.closeAuthModal = function () {
    document.getElementById('auth-overlay').classList.remove('active');
    document.getElementById('auth-sheet').classList.remove('active');
};

window.toggleAuthType = function (type) {
    document.getElementById('tab-email').classList.remove('active');
    document.getElementById('tab-phone').classList.remove('active');
    document.getElementById(`tab-${type}`).classList.add('active');

    document.getElementById('email-section').style.display = type === 'email' ? 'block' : 'none';
    document.getElementById('phone-section').style.display = type === 'phone' ? 'block' : 'none';
};

window.toggleEmailMode = function (mode) {
    const title = document.getElementById('auth-modal-title');
    if (mode === 'signup') {
        document.getElementById('email-login-form').style.display = 'none';
        document.getElementById('email-signup-form').style.display = 'block';
        title.innerText = 'Create New Account';
    } else {
        document.getElementById('email-login-form').style.display = 'block';
        document.getElementById('email-signup-form').style.display = 'none';
        title.innerText = 'Login';
    }
};

window.openForgotPassModal = function () {
    const loginEmail = document.getElementById('login-email').value;
    if (loginEmail) document.getElementById('forgot-email-input').value = loginEmail;

    document.getElementById('forgot-pass-overlay').classList.add('active');
    document.getElementById('forgot-pass-box').classList.add('active');
};

window.closeForgotPassModal = function () {
    document.getElementById('forgot-pass-overlay').classList.remove('active');
    document.getElementById('forgot-pass-box').classList.remove('active');
};

export function translateError(errCode) {
    if (errCode.includes("email-already-in-use")) return "An account is already registered with this email.";
    if (errCode.includes("invalid-credential") || errCode.includes("wrong-password")) return "Incorrect email or password.";
    if (errCode.includes("user-not-found")) return "No account found for this email.";
    if (errCode.includes("invalid-phone-number")) return "Incorrect phone number provided.";
    return "Something went wrong. Please try again.";
}
