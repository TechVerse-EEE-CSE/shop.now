window.showToast = function (msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
};

window.showSmartAlert = function (title, msg, type) {
    document.getElementById('smart-alert-title').innerText = title;
    document.getElementById('smart-alert-msg').innerText = msg;

    const iconBox = document.getElementById('smart-alert-icon');
    iconBox.className = 'smart-box-icon';
    if (type === 'google') {
        iconBox.classList.add('google-icon');
        iconBox.innerHTML = '<i class="fa-brands fa-google"></i>';
    } else if (type === 'email') {
        iconBox.classList.add('email-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-envelope"></i>';
    } else {
        iconBox.classList.add('error-icon');
        iconBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }

    document.getElementById('smart-alert-overlay').classList.add('active');
    document.getElementById('smart-alert-box').classList.add('active');
};

window.closeSmartAlert = function () {
    document.getElementById('smart-alert-overlay').classList.remove('active');
    document.getElementById('smart-alert-box').classList.remove('active');
};
