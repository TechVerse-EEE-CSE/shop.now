import { auth, googleProvider } from './firebase-init.js';
import { state } from './state.js';
import { translateError } from './auth-ui.js';
import {
    signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    sendPasswordResetEmail, RecaptchaVerifier, signInWithPhoneNumber,
    updateProfile, fetchSignInMethodsForEmail
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

function isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return regex.test(password);
}

window.processForgotPassword = async function () {
    const email = document.getElementById('forgot-email-input').value;
    if (!email) return showToast("Please enter your email", "error");

    try {
        await sendPasswordResetEmail(auth, email);
        closeForgotPassModal();
        showSmartAlert("Success!", "Password reset link has been sent to your email. Please check your inbox.", "email");
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            showSmartAlert("Account not found!", "No account found with this email. Please enter a correct email.", "error");
        } else {
            showToast(translateError(error.code), "error");
        }
    }
};

window.handleGoogleLogin = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
        closeAuthModal(); showToast("Google login successful!");
    } catch (error) {
        if (error.code === 'auth/account-exists-with-different-credential' || error.code === 'auth/email-already-in-use') {
            showSmartAlert("Account exists with this email!", "You already have an account with this email. Please login with your password in the 'Email' tab.", "email");
        } else {
            showToast(translateError(error.code), "error");
        }
    }
};

window.handleEmailSignup = async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const pass = document.getElementById('signup-pass').value;
    const confirmPass = document.getElementById('signup-confirm-pass').value;

    if (!name || !email || !pass || !confirmPass) return showToast("Please provide all information correctly", "error");
    if (pass !== confirmPass) return showToast("Passwords do not match. Please try again.", "error");

    if (!isStrongPassword(pass)) {
        return showToast("Password must contain at least 8 characters, one uppercase, one lowercase letter (A-z), and one number (0-9).", "error");
    }

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
            if (methods.includes('google.com')) {
                showSmartAlert("Google Account Exists!", "A Google account already exists with this email. Please login by clicking 'Continue with Google' below.", "google");
                return;
            } else if (methods.includes('password')) {
                showSmartAlert("Account Exists!", "An account is already registered with this email. Please login.", "email");
                return;
            }
        }
    } catch (e) { }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: name });
        auth.updateCurrentUser(userCredential.user);

        closeAuthModal(); showToast("Alhamdulillah! Account created successfully.");
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showSmartAlert("Account Exists!", "An account already exists with this email. Please login or try with Google.", "error");
        } else {
            showToast(translateError(error.code), "error");
        }
    }
};

window.handleEmailLogin = async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) return showToast("Please provide email and password", "error");

    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes('google.com') && !methods.includes('password')) {
            return showSmartAlert("Google Account!", "You have already registered a Google account with this email. Please click 'Continue with Google' to login.", "google");
        }
    } catch (e) { }

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        closeAuthModal(); showToast("Login successful!");
    } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            try {
                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.includes('google.com') && !methods.includes('password')) {
                    return showSmartAlert("Google Account!", "You have already registered a Google account with this email. Please click 'Continue with Google' to login.", "google");
                }
            } catch (e) { }
        }
        showToast(translateError(error.code), "error");
    }
};

window.sendOTP = async () => {
    const phone = document.getElementById('phone-input').value;
    if (phone.length !== 10 && phone.length !== 11) return showToast("Please enter a valid mobile number (e.g., 017XXXXXXXX)", "error");

    const formatPhone = phone.startsWith('0') ? '+88' + phone : '+880' + phone;

    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'normal' });
    }

    try {
        showToast("Sending OTP...");
        state.confirmationResult = await signInWithPhoneNumber(auth, formatPhone, window.recaptchaVerifier);
        document.getElementById('phone-input-step').style.display = 'none';
        document.getElementById('otp-step').style.display = 'block';
        showToast("OTP sent to your mobile!");
    } catch (error) {
        showToast("Failed to send OTP. Please try again.", "error");
        console.error(error);
    }
};

window.verifyOTP = async () => {
    const code = document.getElementById('otp-input').value;
    if (code.length < 6) return showToast("Please enter the correct 6-digit code", "error");

    try {
        await state.confirmationResult.confirm(code);
        closeAuthModal(); showToast("Phone verification successful!");
    } catch (error) { showToast("Invalid OTP code!", "error"); }
};
