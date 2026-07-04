import { db } from './firebase-init.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { state, saveCart } from './state.js';
import { renderCart, updateCartBadge } from './cart.js';

window.processCheckout = function () {
    if (!state.currentUser) return showToast("Please login to place an order", "error");
    if (state.cart.length === 0) return showToast("Your cart is empty!", "error");

    const custName = document.getElementById('cust-name').value.trim();
    const custPhone = document.getElementById('cust-phone').value.trim();
    const custAddress = document.getElementById('cust-address').value.trim();

    if (!custName || !custPhone || !custAddress) {
        return showToast("Please provide your name, mobile number, and address correctly", "error");
    }

    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    if (!phoneRegex.test(custPhone)) {
        return showToast("Please enter a valid BD mobile number (e.g., 017XXXXXXXX)", "error");
    }

    document.getElementById('payment-total-price').innerText = document.getElementById('total-price').innerText;
    document.getElementById('payment-overlay').classList.add('active');
    document.getElementById('payment-sheet').classList.add('active');

    selectPayment('Cash on Delivery');
    document.getElementById('trx-id').value = '';
};

window.confirmFinalOrder = async function () {
    let trxId = document.getElementById('trx-id').value;
    if (state.selectedPaymentMethod !== 'Cash on Delivery' && trxId.trim() === '') {
        return showToast("Please enter Transaction ID", "error");
    }

    const custName = document.getElementById('cust-name').value.trim();
    const custPhone = document.getElementById('cust-phone').value.trim();
    const custAddress = document.getElementById('cust-address').value.trim();

    showToast("Processing order...");
    closePaymentModal();

    try {
        const orderId = "order_" + new Date().getTime();
        const orderDocRef = doc(db, "orders", orderId);

        let subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        let currentDiscountAmount = state.appliedVoucher === 'SHOPVERSE' ? Math.round(subtotal * 0.10) : 0;
        let finalTotalAmount = subtotal + state.deliveryCharge - currentDiscountAmount;
        let areaText = state.deliveryArea === 'inside' ? "Inside Sirajganj" : "Outside Sirajganj";

        await setDoc(orderDocRef, {
            orderId: orderId,
            userId: state.currentUser.uid,
            userEmail: state.currentUser.email || "Mobile User",
            userName: state.currentUser.displayName || "Guest",
            customerName: custName,
            customerPhone: custPhone,
            customerAddress: custAddress,
            items: state.cart,
            subtotal: subtotal,
            discountAmount: currentDiscountAmount,
            voucherCode: state.appliedVoucher || "None",
            deliveryCharge: state.deliveryCharge,
            deliveryArea: areaText,
            totalAmount: finalTotalAmount,
            paymentMethod: state.selectedPaymentMethod,
            transactionId: trxId || "N/A",
            status: "Pending",
            timestamp: new Date().toISOString()
        });

        if (state.appliedVoucher === 'SHOPVERSE') {
            localStorage.setItem(`used_voucher_${state.currentUser.uid}`, 'true');
            state.hasUsedVoucher = true;
        }

        state.appliedVoucher = null;
        state.discountAmount = 0;
        document.getElementById('voucher-input').value = '';

        showToast("Alhamdulillah, order successfully saved in database!");
        state.cart = [];
        localStorage.removeItem('shopVerseCart');
        setTimeout(() => renderCart(), 1000);
        updateCartBadge();

    } catch (error) {
        console.error("Firestore Error: ", error);
        showToast("Failed to save in database.", "error");
    }
};
