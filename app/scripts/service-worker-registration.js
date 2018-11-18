'use strict';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('Service worker registered with scope: ', registration.scope);
        }).catch(function(e) {
            console.error('Failed to register service worker: ', e);
        });
    });
}
