import { renderCart } from './cart.js';

window.switchScreen = function (screenName, element) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`${screenName}-screen`).classList.add('active');
    if (element) element.classList.add('active');
    if (screenName === 'cart') renderCart();
};
