/* ===================================================================
   Integral Cup 2026 — Theme Manager
   Handles dark/light mode toggle + iframe communication
   =================================================================== */
(function () {
    'use strict';

    const STORAGE_KEY = 'integral-cup-theme';
    const html = document.documentElement;

    // Detect if running inside an iframe
    const isInIframe = window !== window.parent;
    if (isInIframe) {
        document.body.classList.add('in-iframe');
    }

    // ── Get stored or default theme ──
    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch {
            return 'dark';
        }
    }

    // ── Apply theme ──
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch { /* ignore */ }

        // Update toggle button icon if present
        const btn = document.querySelector('.theme-toggle-standalone');
        if (btn) {
            btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }

    // ── Initialize theme ──
    applyTheme(getStoredTheme());

    // ── Create standalone toggle button (hidden in iframe) ──
    if (!isInIframe) {
        const btn = document.createElement('button');
        btn.className = 'theme-toggle-standalone';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.addEventListener('click', function () {
            const current = html.getAttribute('data-theme') || 'dark';
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
        document.body.appendChild(btn);
        // Set initial icon
        btn.textContent = getStoredTheme() === 'dark' ? '☀️' : '🌙';
    }

    // ── Listen for theme messages from parent (iframe mode) ──
    window.addEventListener('message', function (e) {
        if (e.data && e.data.type === 'set-theme') {
            applyTheme(e.data.theme);
        }
    });
})();
