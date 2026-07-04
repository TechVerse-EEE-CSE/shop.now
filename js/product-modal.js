window.openProductModal = function (name, desc, imgUrl, iconClass, price) {
    document.getElementById('pm-title').innerText = name;
    document.getElementById('pm-desc').innerText = desc || 'কোনো বিবরণ দেওয়া নেই।';
    document.getElementById('pm-price').innerText = '৳ ' + price;

    const wrapper = document.getElementById('pm-img-wrapper');
    if (imgUrl && imgUrl !== 'undefined' && imgUrl !== '') {
        wrapper.innerHTML = `<img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        wrapper.innerHTML = `<i class="${iconClass}" style="font-size: 80px; color: var(--teal);"></i>`;
    }

    document.getElementById('product-modal-overlay').classList.add('active');
    document.getElementById('product-modal-box').classList.add('active');
};

window.closeProductModal = function () {
    document.getElementById('product-modal-overlay').classList.remove('active');
    document.getElementById('product-modal-box').classList.remove('active');
};
