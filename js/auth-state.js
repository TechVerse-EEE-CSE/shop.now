import { auth } from './firebase-init.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { state } from './state.js';
import { listenToUserOrders } from './orders.js';
import { renderCart } from './cart.js';

onAuthStateChanged(auth, (user) => {
    state.currentUser = user;
    window.__currentUser = user; // lightweight read for inline modules
    const profileBtn = document.getElementById('profile-auth-btn');
    const headerBtn = document.getElementById('auth-btn');
    const orderSec = document.getElementById('order-history-section');

    if (user) {
        const displayId = user.displayName || user.email || user.phoneNumber;
        headerBtn.innerText = "Logout";
        profileBtn.innerText = "Logout";
        profileBtn.style.background = "var(--coral)";
        profileBtn.style.boxShadow = "0 8px 18px -4px rgba(230,83,60,0.45)";
        document.getElementById('profile-name').innerText = displayId;
        document.getElementById('profile-email').innerText = user.email || "Mobile User";
        if (user.photoURL) {
            document.getElementById('profile-icon').style.display = 'none';
            document.getElementById('profile-pic').style.display = 'block';
            document.getElementById('profile-pic').src = user.photoURL;
        }

        if (orderSec) orderSec.style.display = 'block';
        listenToUserOrders(user.uid);

        if (document.getElementById('cust-name') && !document.getElementById('cust-name').value) {
            document.getElementById('cust-name').value = user.displayName || '';
        }
        if (document.getElementById('cust-phone') && !document.getElementById('cust-phone').value) {
            let rawPhone = user.phoneNumber || '';
            if (rawPhone.startsWith('+880')) rawPhone = rawPhone.replace('+880', '0');
            document.getElementById('cust-phone').value = rawPhone;
        }
    } else {
        headerBtn.innerText = "Login";
        profileBtn.innerText = "Login";
        profileBtn.style.background = "var(--teal)";
        profileBtn.style.boxShadow = "0 8px 18px -4px rgba(15,110,98,0.45)";
        document.getElementById('profile-name').innerText = "Guest User";
        document.getElementById('profile-email').innerText = "Please login to purchase products";
        document.getElementById('profile-icon').style.display = 'block';
        document.getElementById('profile-pic').style.display = 'none';

        state.hasUsedVoucher = false;
        state.appliedVoucher = null;
        state.discountAmount = 0;
        if (document.getElementById('voucher-input')) document.getElementById('voucher-input').value = '';

        if (orderSec) orderSec.style.display = 'none';
        if (state.unsubscribeOrders) { state.unsubscribeOrders(); state.unsubscribeOrders = null; }
        document.getElementById('order-list-container').innerHTML = '';

        if (document.getElementById('cust-name')) document.getElementById('cust-name').value = '';
        if (document.getElementById('cust-phone')) document.getElementById('cust-phone').value = '';
        if (document.getElementById('cust-address')) document.getElementById('cust-address').value = '';
        renderCart();
    }
});
