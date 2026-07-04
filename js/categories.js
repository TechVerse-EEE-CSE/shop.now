import { state } from './state.js';
import { renderProductGrid } from './products.js';

const ICONS = {
    'All': 'fa-solid fa-border-all',
    'Others': 'fa-solid fa-shapes'
};

export function renderCategoryChips() {
    const rail = document.getElementById('category-rail');
    if (!rail) return;

    const categories = ['All', ...new Set(state.allProducts.map(p => p.category || 'Others'))];

    rail.innerHTML = categories.map(cat => {
        const icon = ICONS[cat] || 'fa-solid fa-tag';
        const activeClass = cat === state.activeCategory ? 'active' : '';
        return `<div class="category-chip ${activeClass}" onclick="setActiveCategory('${cat.replace(/'/g, "\\'")}')">
                    <i class="${icon}"></i> ${cat}
                </div>`;
    }).join('');
}

window.setActiveCategory = function (cat) {
    state.activeCategory = cat;
    renderCategoryChips();
    renderProductGrid();
};
