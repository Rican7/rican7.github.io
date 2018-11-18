'use strict';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function() {
            console.log('Service worker registered!');
        }).catch(function(e) {
            console.error('Failed to register service worker', e);
        });
    });
}
