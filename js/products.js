import { db } from './firebase-init.js';
import { collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { state } from './state.js';
import { renderCategoryChips } from './categories.js';

function starRow(rating, count) {
    const r = rating || 4.5;
    return `<div class="pc-rating"><i class="fa-solid fa-star"></i> ${r.toFixed ? r.toFixed(1) : r} <span>(${count || 0})</span></div>`;
}

function buildCard(p) {
    const media = (p.imageUrl || p.image)
        ? `<img src="${p.imageUrl || p.image}" alt="${p.name}">`
        : `<i class="${p.icon || 'fa-solid fa-box'} product-img"></i>`;

    const hasDiscount = p.oldPrice && p.oldPrice > p.price;
    const discountPct = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
    const outOfStock = p.stock === 'Out of Stock';

    const safeName = p.name ? p.name.replace(/'/g, "\\'") : 'Item';
    const safeDesc = p.desc ? p.desc.replace(/'/g, "\\'").replace(/\n/g, "\\n") : '';

    return `
    <div class="product-card">
        <div class="pc-media" onclick="openProductModal('${safeName}', '${safeDesc}', '${p.imageUrl || p.image || ''}', '${p.icon || 'fa-solid fa-box'}', ${p.price || 0})">
            ${hasDiscount ? `<div class="pc-badge-discount">-${discountPct}%</div>` : ''}
            ${media}
            ${p.soldCount ? `<div class="pc-badge-stock"><i class="fa-solid fa-fire"></i> ${p.soldCount} Sold</div>` : ''}
            ${outOfStock ? '' : `<div class="pc-fab-add" onclick="event.stopPropagation(); addToCart('${p.id}', '${safeName}', ${p.price || 0})"><i class="fa-solid fa-cart-plus"></i></div>`}
        </div>
        <div class="pc-body">
            <div class="pc-title">${p.name || 'No Name'}</div>
            ${starRow(p.rating, p.ratingCount)}
            <div class="pc-price-row">
                <span class="pc-price-now">৳ ${p.price || 0}</span>
                ${hasDiscount ? `<span class="pc-price-old">৳ ${p.oldPrice}</span>` : ''}
            </div>
            ${outOfStock ? `<div class="pc-outofstock-tag"><i class="fa-solid fa-ban"></i> Stock Out</div>` : ''}
        </div>
    </div>`;
}

export function renderProductGrid() {
    const container = document.getElementById('product-container');
    if (!container) return;

    const filtered = state.activeCategory === 'All'
        ? state.allProducts
        : state.allProducts.filter(p => (p.category || 'Others') === state.activeCategory);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: span 2; text-align: center; color: var(--muted); padding: 40px 10px;">
                <i class="fa-solid fa-box-open" style="font-size: 40px; color: var(--line); margin-bottom: 15px; display:block;"></i>
                <h3 style="font-size: 15px; font-weight: 700;">No products in this category!</h3>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(buildCard).join('');
}

export function loadProductsFromFirestore() {
    const container = document.getElementById('product-container');
    container.innerHTML = `
        <div style="grid-column: span 2; text-align: center; padding: 40px 10px;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 32px; color: var(--teal);"></i>
            <p style="margin-top:15px; color: var(--muted); font-weight: 600; font-size: 14px;">Searching for products...</p>
        </div>`;

    if (state.unsubscribeProducts) state.unsubscribeProducts();

    const q = query(collection(db, "products"));

    state.unsubscribeProducts = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            container.innerHTML = `
                <div style="grid-column: span 2; text-align: center; color: var(--muted); padding: 40px 10px;">
                    <i class="fa-solid fa-box-open" style="font-size: 40px; color: var(--line); margin-bottom: 15px; display:block;"></i>
                    <h3 style="font-size: 16px; font-weight: 700;">No products found!</h3>
                    <p style="font-size: 13px; margin-top: 5px;">Please wait.</p>
                </div>`;
            return;
        }

        state.allProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderCategoryChips();
        renderProductGrid();
    }, (error) => {
        console.error("Error fetching products:", error);
        container.innerHTML = `
            <div style="grid-column: span 2; text-align: center; padding: 40px 10px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 35px; color: var(--coral); margin-bottom: 10px; display:block;"></i>
                <p style="color: var(--coral); font-weight: 700;">Problem loading products!</p>
            </div>`;
    });
}
