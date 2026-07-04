(function () {
    if (!('serviceWorker' in navigator)) return;

    function saveReturnURL() {
        const url = window.location.href;
        if (!url.includes('offline')) {
            sessionStorage.setItem('offlineReturnURL', url);
        }
    }

    saveReturnURL();

    window.addEventListener('popstate', saveReturnURL);
    window.addEventListener('pushstate', saveReturnURL);
    window.addEventListener('hashchange', saveReturnURL);

    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then(function (registration) {
                console.log('[SW] Registered successfully. Scope:', registration.scope);
            })
            .catch(function (error) {
                console.warn('[SW] Registration failed:', error);
            });
    });
})();
