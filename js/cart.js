import { state, saveCart } from './state.js';

window.addToCart = function (id, name, price) {
    if (!state.currentUser) { showToast("Please login first", "error"); openAuthModal(); return; }
    const item = state.cart.find(i => i.id === id);
    if (item) item.qty++; else state.cart.push({ id, name, price, qty: 1 });
    saveCart();
    updateCartBadge(); showToast("Added to cart");
};

window.removeFromCart = function (id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast("Item removed from cart", "error");
};

window.increaseQty = function (id) {
    const item = state.cart.find(i => i.id === id);
    if (item) item.qty++;
    saveCart();
    updateCartBadge(); renderCart();
};

window.decreaseQty = function (id) {
    const item = state.cart.find(i => i.id === id);
    if (item && item.qty > 1) {
        item.qty--;
        saveCart();
        updateCartBadge(); renderCart();
    } else if (item && item.qty === 1) {
        removeFromCart(id);
    }
};

export function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    badge.innerText = state.cart.reduce((sum, item) => sum + item.qty, 0);
    badge.classList.remove('pop-anim');
    void badge.offsetWidth;
    badge.classList.add('pop-anim');
}

export function renderCart() {
    const container = document.getElementById('cart-container');
    const checkoutSec = document.getElementById('checkout-section');
    if (state.cart.length === 0) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-basket-shopping"></i><h3>Cart is empty!</h3></div>`;
        checkoutSec.style.display = 'none'; return;
    }

    container.innerHTML = ''; let subtotal = 0;

    state.cart.forEach(item => {
        subtotal += item.price * item.qty;
        container.innerHTML += `<div class="cart-item">
            <div style="flex: 1;">
                <h4>${item.name}</h4>
                <div style="color:var(--muted); font-size:13px; font-weight:600; display:flex; align-items:center; gap:10px;">
                    ৳ ${item.price}
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="decreaseQty('${item.id}')"><i class="fa-solid fa-minus" style="font-size:10px;"></i></button>
                        <span class="qty-text">${item.qty}</span>
                        <button class="qty-btn" onclick="increaseQty('${item.id}')"><i class="fa-solid fa-plus" style="font-size:10px;"></i></button>
                    </div>
                </div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
                <div class="cart-item-price">৳ ${item.price * item.qty}</div>
                <button onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: var(--coral); cursor: pointer; font-size: 16px; padding: 5px;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>`;
    });

    if (state.appliedVoucher === 'SHOPVERSE') {
        state.discountAmount = Math.round(subtotal * 0.10);
        document.getElementById('discount-row').classList.add('active');
        document.getElementById('discount-display').innerText = `- ৳ ${state.discountAmount}`;

        const vBtn = document.getElementById('voucher-btn');
        document.getElementById('voucher-input').disabled = true;
        vBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Remove';
        vBtn.style.background = 'var(--coral)';
    } else {
        state.discountAmount = 0;
        document.getElementById('discount-row').classList.remove('active');

        const vBtn = document.getElementById('voucher-btn');
        document.getElementById('voucher-input').disabled = false;
        vBtn.innerHTML = 'Apply';
        vBtn.style.background = 'var(--ink)';
    }

    let finalTotal = subtotal + state.deliveryCharge - state.discountAmount;

    document.getElementById('subtotal-price').innerText = `৳ ${subtotal}`;
    document.getElementById('delivery-charge-display').innerText = `৳ ${state.deliveryCharge}`;
    document.getElementById('total-price').innerText = `৳ ${finalTotal}`;

    checkoutSec.style.display = 'block';
}

window.setDeliveryArea = function (area) {
    state.deliveryArea = area;
    state.deliveryCharge = area === 'inside' ? 70 : 130;

    document.getElementById('del-inside').classList.remove('active');
    document.getElementById('del-outside').classList.remove('active');
    document.getElementById(`del-${area}`).classList.add('active');

    renderCart();
};
