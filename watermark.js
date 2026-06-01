/**
 * YourSticker — Watermark & Image Protection System
 * Applies premium semi-transparent watermark to product images
 * and prevents casual image downloading.
 */
(function () {
    'use strict';

    var SELECTORS = [
        '.sy-img-box img',
        '.pdp-main-image',
        '.pdp-related-img img'
    ];

    function isTarget(img) {
        if (!img || img.tagName !== 'IMG') return false;
        if (img.closest('.watermark-container')) return false;
        if (img.closest('.cart-item-img')) return false;
        if (img.closest('.hero-sticker')) return false;
        if (img.closest('.upload-section')) return false;
        if (img.closest('.preview-item')) return false;
        if (img.closest('.admin-login-overlay')) return false;
        return SELECTORS.some(function (sel) {
            try { return img.matches(sel); } catch (e) { return false; }
        });
    }

    function protectImage(img) {
        if (!isTarget(img)) return;

        img.setAttribute('draggable', 'false');

        var wrapper = document.createElement('div');
        wrapper.className = 'watermark-container';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        var overlay = document.createElement('div');
        overlay.className = 'watermark-protection';
        wrapper.appendChild(overlay);
    }

    function init() {
        SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(protectImage);
        });

        document.addEventListener('contextmenu', function (e) {
            if (e.target.closest('.watermark-container') ||
                e.target.closest('.admin-gallery-item')) {
                e.preventDefault();
                return false;
            }
        });

        document.addEventListener('dragstart', function (e) {
            if (e.target.closest('.watermark-container')) {
                e.preventDefault();
                return false;
            }
        });

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                [].slice.call(m.addedNodes).forEach(function (node) {
                    if (node.nodeType === 1) {
                        SELECTORS.forEach(function (sel) {
                            if (node.matches && node.matches(sel)) protectImage(node);
                            [].slice.call(node.querySelectorAll(sel)).forEach(protectImage);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
