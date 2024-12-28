// env.js
(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"].API_URL_BASE = 'http://192.168.1.250:8099/';
    window["env"].API_URL_IDENTITY = 'http://192.168.1.250:8020/';
    window["env"].URL_IDENTITY = 'http://192.168.18.3:8087/';
})(this);