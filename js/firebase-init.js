import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_2mcIc6bsva2zJiAJl9vBZCn_d7K4-2Y",
    authDomain: "shopverse-signup.firebaseapp.com",
    projectId: "shopverse-signup",
    storageBucket: "shopverse-signup.firebasestorage.app",
    messagingSenderId: "139812126519",
    appId: "1:139812126519:web:30efeceee0b54a0a5964b2",
    measurementId: "G-SRYF64JX3N"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
