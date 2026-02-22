/**
 * ripple.js — M3 Ripple Effect
 * Applies Material Design ripple to any element with class .m3-ripple
 * Calculates ripple origin from click coordinates.
 */
(function () {
    'use strict';

    function createRipple(e) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();

        const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (e.clientY || rect.top + rect.height / 2) - rect.top;

        // Make the ripple large enough to cover the element
        const size = Math.max(rect.width, rect.height) * 2;

        const circle = document.createElement('span');
        circle.className = 'ripple-circle';
        circle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
    `;

        target.appendChild(circle);

        circle.addEventListener('animationend', () => circle.remove(), { once: true });
    }

    function attachRipple(el) {
        if (el._rippleAttached) return;
        el.addEventListener('click', createRipple);
        el._rippleAttached = true;
    }

    function attachAll() {
        document.querySelectorAll('.m3-ripple, .btn, .nav-item, .chip, .list-tile').forEach(attachRipple);
    }

    // ── MutationObserver: auto-attach to new elements ──────────────────
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (
                    node.classList.contains('m3-ripple') ||
                    node.classList.contains('btn') ||
                    node.classList.contains('nav-item') ||
                    node.classList.contains('chip') ||
                    node.classList.contains('list-tile')
                ) {
                    attachRipple(node);
                }
                node.querySelectorAll('.m3-ripple, .btn, .nav-item, .chip, .list-tile').forEach(attachRipple);
            });
        });
    });

    function init() {
        attachAll();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.M3Ripple = { init, attachRipple };
})();
