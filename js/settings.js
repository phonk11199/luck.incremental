'use strict';

let settingsBtn = document.getElementById('settingsBtn');

settingsBtn.onclick = function () {
    showInterface('settings');
    document.body.style.background = '#00ffff';
    document.body.style.color = '#000';
};