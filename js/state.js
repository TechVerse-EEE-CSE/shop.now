export const state = {
    currentUser: null,
    cart: JSON.parse(localStorage.getItem('shopVerseCart')) || [],
    confirmationResult: null,
    selectedPaymentMethod: 'Cash on Delivery',
    unsubscribeOrders: null,
    unsubscribeProducts: null,
    deliveryArea: 'inside',
    deliveryCharge: 70,
    appliedVoucher: null,
    discountAmount: 0,
    hasUsedVoucher: false,
    allProducts: [],
    activeCategory: 'All'
};

export function saveCart() {
    localStorage.setItem('shopVerseCart', JSON.stringify(state.cart));
}
