import { db } from './firebase-init.js';
import { collection, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { state } from './state.js';

export function listenToUserOrders(uid) {
    if (state.unsubscribeOrders) state.unsubscribeOrders();

    const q = query(collection(db, "orders"), where("userId", "==", uid));

    state.unsubscribeOrders = onSnapshot(q, (snapshot) => {
        const container = document.getElementById('order-list-container');
        if (!container) return;

        state.hasUsedVoucher = false;

        if (snapshot.empty) {
            container.innerHTML = `
                <div style="text-align: center; color: var(--muted); padding: 30px 10px; font-weight: 600; font-size: 14px;">
                    <i class="fa-solid fa-box-open" style="font-size: 40px; color: var(--line); display: block; margin-bottom: 10px;"></i>
                    You haven't placed any orders yet!
                </div>`;
            return;
        }

        let ordersArray = [];
        snapshot.forEach(doc => {
            let data = { id: doc.id, ...doc.data() };
            ordersArray.push(data);
            if (data.voucherCode === 'SHOPVERSE') state.hasUsedVoucher = true;
        });

        if (state.hasUsedVoucher) localStorage.setItem(`used_voucher_${uid}`, 'true');

        ordersArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        container.innerHTML = '';
        ordersArray.forEach(order => {
            let formattedDate = "N/A";
            if (order.timestamp) {
                const d = new Date(order.timestamp);
                formattedDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + " | " + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }

            let statusClass = order.status === 'Pending' ? 'status-pending' : 'status-success';
            let statusText = order.status === 'Pending' ? 'Pending' : (order.status === 'Delivered' ? 'Delivered' : order.status);

            let itemsHtml = '';
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    itemsHtml += `
                        <div class="order-item-line">
                            <span>${item.name} <small style="color:var(--muted);font-weight:500;">(x${item.qty})</small></span>
                            <span>৳${item.price * item.qty}</span>
                        </div>`;
                });
            }

            let discountHtml = '';
            if (order.discountAmount > 0) {
                discountHtml = `
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--coral); margin-bottom: 4px; font-weight: 700;">
                    <span>Discount (${order.voucherCode}):</span>
                    <span>- ৳ ${order.discountAmount}</span>
                </div>`;
            }

            container.innerHTML += `
                <div class="order-card">
                    <div class="order-card-header">
                        <span class="order-id-txt"><i class="fa-solid fa-hashtag"></i> ID: ${order.orderId ? order.orderId.replace('order_', '') : order.id}</span>
                        <span class="order-status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="order-card-body">
                        <div style="margin-bottom: 8px; border-bottom: 1px dashed var(--cream); padding-bottom: 6px;">
                            ${itemsHtml}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); margin-bottom: 4px; font-weight: 600;">
                            <span>Delivery Charge (${order.deliveryArea || 'N/A'}):</span>
                            <span>৳ ${order.deliveryCharge || 0}</span>
                        </div>
                        ${discountHtml}
                        <div style="display: flex; justify-content: space-between; font-weight: 800; color: var(--ink); font-size: 14px; margin-bottom: 2px;">
                            <span>Total Price:</span>
                            <span style="color: var(--teal-dark);">৳ ${order.totalAmount || 0}</span>
                        </div>
                        <div class="order-meta-info">
                            <span><i class="fa-solid fa-wallet"></i> ${order.paymentMethod || 'N/A'}</span>
                            <span><i class="fa-solid fa-calendar-day"></i> ${formattedDate}</span>
                        </div>
                        ${order.transactionId && order.transactionId !== 'N/A' ? `
                        <div style="font-size: 11px; background: var(--cream); padding: 6px 10px; border-radius: 8px; margin-top: 8px; font-weight: 600; display: flex; justify-content: space-between; border: 1px solid var(--line);">
                            <span style="color:var(--muted);">TrxID:</span>
                            <span style="color:var(--ink); font-family: monospace;">${order.transactionId}</span>
                        </div>` : ''}
                    </div>
                </div>`;
        });
    });
}
