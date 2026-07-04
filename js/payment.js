import { state } from './state.js';

window.closePaymentModal = function () {
    document.getElementById('payment-overlay').classList.remove('active');
    document.getElementById('payment-sheet').classList.remove('active');
};

window.selectPayment = function (method) {
    state.selectedPaymentMethod = method;
    document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));

    let targetId = method === 'Cash on Delivery' ? 'card-cod' : (method === 'bKash' ? 'card-bkash' : 'card-nagad');
    document.getElementById(targetId).classList.add('active');

    if (method !== 'Cash on Delivery') {
        document.getElementById('mobile-banking-details').classList.add('active');
    } else {
        document.getElementById('mobile-banking-details').classList.remove('active');
    }
};
