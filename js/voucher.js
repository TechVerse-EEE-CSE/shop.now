import { state } from './state.js';
import { renderCart } from './cart.js';

window.handleVoucherAction = function () {
    if (!state.currentUser) return showToast("Please login to apply voucher", "error");

    if (state.appliedVoucher === 'SHOPVERSE') {
        state.appliedVoucher = null;
        document.getElementById('voucher-input').value = '';
        showToast("Voucher removed", "error");
        renderCart();
        return;
    }

    const code = document.getElementById('voucher-input').value.trim().toUpperCase();
    if (!code) return showToast("Please enter a voucher code", "error");
    if (code !== 'SHOPVERSE') return showToast("Invalid voucher code", "error");

    const storageKey = `used_voucher_${state.currentUser.uid}`;
    if (localStorage.getItem(storageKey) === 'true' || state.hasUsedVoucher) {
        return showSmartAlert("Offer Claimed!", "You have already claimed this 10% discount for a previous order.", "error");
    }

    state.appliedVoucher = 'SHOPVERSE';
    showToast("Voucher applied! 10% Discount added.");
    renderCart();
};
