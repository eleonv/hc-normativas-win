(function (window) {
    window.env = window.env || {};

    // Environment variables
    window["env"].API_URL_BASE = '${ENV_API_URL_BASE}/';
    window["env"].API_URL_IDENTITY = '${ENV_API_URL_IDENTITY}/';
    window["env"].URL_IDENTITY = '${ENV_URL_IDENTITY}/';
})(this);