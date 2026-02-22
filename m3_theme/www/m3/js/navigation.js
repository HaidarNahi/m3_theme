/**
 * navigation.js — M3 Responsive Navigation System
 * Manages: Rail ↔ Drawer ↔ Bottom Bar transitions,
 * hamburger toggle, active states, aria-current.
 */
(function () {
    'use strict';

    // ── Breakpoints matching layout.css ──────────────────────────────────
    const BREAKPOINTS = {
        MOBILE: 600,   // < 600 → Bottom Nav
        TABLET: 905,   // 600–904 → Rail
        MID_TABLET: 1240,   // 905–1239 → Rail + modal drawer
        DESKTOP: 1440,   // 1240–1439 → Collapsible drawer
        // ≥ 1440 → Persistent drawer
    };

    let isDrawerOpen = false;

    // ── Get current layout mode ───────────────────────────────────────────
    function getLayoutMode() {
        const w = window.innerWidth;
        if (w < BREAKPOINTS.MOBILE) return 'bottom-nav';
        if (w < BREAKPOINTS.TABLET) return 'rail';
        if (w < BREAKPOINTS.MID_TABLET) return 'rail-modal';
        if (w < BREAKPOINTS.DESKTOP) return 'drawer';
        return 'drawer-persistent';
    }

    // ── Open / close modal drawer (tablet) ──────────────────────────────
    function openDrawer() {
        const drawer = document.querySelector('.nav-drawer');
        const scrim = document.querySelector('.nav-scrim');
        if (!drawer) return;
        drawer.classList.add('modal-open');
        if (scrim) scrim.classList.add('visible');
        isDrawerOpen = true;
        document.body.style.overflow = 'hidden';
        drawer.setAttribute('aria-hidden', 'false');
    }

    function closeDrawer() {
        const drawer = document.querySelector('.nav-drawer');
        const scrim = document.querySelector('.nav-scrim');
        if (!drawer) return;
        drawer.classList.remove('modal-open');
        if (scrim) scrim.classList.remove('visible');
        isDrawerOpen = false;
        document.body.style.overflow = '';
        drawer.setAttribute('aria-hidden', 'true');
    }

    function toggleDrawer() {
        const mode = getLayoutMode();
        if (mode === 'rail-modal') {
            isDrawerOpen ? closeDrawer() : openDrawer();
        } else if (mode === 'drawer' || mode === 'drawer-persistent') {
            // On desktop, collapse/expand between 80px rail and 280px drawer
            const appShell = document.querySelector('.app-shell');
            const drawer = document.querySelector('.nav-drawer');
            if (!appShell || !drawer) return;
            if (appShell.classList.contains('drawer-collapsed')) {
                appShell.classList.remove('drawer-collapsed');
            } else {
                appShell.classList.add('drawer-collapsed');
            }
        }
    }

    // Collapsed drawer on desktop: behave like a rail
    const drawerCollapsedStyles = `
    .app-shell.drawer-collapsed { grid-template-columns: 80px 1fr !important; }
    .app-shell.drawer-collapsed .nav-drawer { width: 80px !important; border-radius: 0 !important; padding: 12px 0; }
    .app-shell.drawer-collapsed .nav-drawer .nav-item { flex-direction: column; width: 80px; margin: 2px 0; border-radius: 0; padding: 4px 0; }
    .app-shell.drawer-collapsed .nav-drawer .nav-item-label { display: none; }
    .app-shell.drawer-collapsed .nav-drawer .nav-drawer-section-title { display: none; }
    .app-shell.drawer-collapsed .nav-drawer .nav-item.active { background: var(--md-sys-color-secondary-container); border-radius: var(--md-sys-shape-corner-full); width: 56px; margin: 2px auto; }
  `;

    function injectCollapsedStyles() {
        if (document.getElementById('m3-collapsed-style')) return;
        const style = document.createElement('style');
        style.id = 'm3-collapsed-style';
        style.textContent = drawerCollapsedStyles;
        document.head.appendChild(style);
    }

    // ── Set active nav item ───────────────────────────────────────────────
    function setActiveNavItem(pageId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            const active = item.dataset.page === pageId;
            item.classList.toggle('active', active);
            item.setAttribute('aria-current', active ? 'page' : 'false');

            // Switch icon fill for active state
            const icon = item.querySelector('.material-symbols-outlined');
            if (icon) {
                if (active) {
                    icon.classList.add('filled');
                } else {
                    icon.classList.remove('filled');
                }
            }
        });
    }

    // ── Handle resize ─────────────────────────────────────────────────────
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const mode = getLayoutMode();
            // Auto-close modal drawer when resizing to bigger screen
            if (mode !== 'rail-modal' && isDrawerOpen) closeDrawer();
        }, 100);
    }

    // ── Keyboard navigation in rail/drawer ──────────────────────────────
    function onNavKeyDown(e) {
        const items = Array.from(document.querySelectorAll('.nav-item:not([disabled])'));
        const idx = items.indexOf(e.currentTarget);
        if (e.key === 'ArrowDown' && idx < items.length - 1) {
            e.preventDefault();
            items[idx + 1].focus();
        }
        if (e.key === 'ArrowUp' && idx > 0) {
            e.preventDefault();
            items[idx - 1].focus();
        }
        if (e.key === 'Escape' && isDrawerOpen) closeDrawer();
    }

    // ── Scroll: elevate top bar ───────────────────────────────────────────
    function wireScrollElevation() {
        const contentArea = document.querySelector('.app-content');
        const topBar = document.querySelector('.app-top-bar');
        if (!contentArea || !topBar) return;
        contentArea.addEventListener('scroll', () => {
            topBar.classList.toggle('elevated', contentArea.scrollTop > 4);
        }, { passive: true });
    }

    // ── Init ─────────────────────────────────────────────────────────────
    function init() {
        injectCollapsedStyles();

        // Hamburger / nav toggle button
        const hamburger = document.getElementById('nav-toggle');
        if (hamburger) hamburger.addEventListener('click', toggleDrawer);

        // Scrim close
        const scrim = document.querySelector('.nav-scrim');
        if (scrim) scrim.addEventListener('click', closeDrawer);

        // Nav item keyboard events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.setAttribute('role', 'link');
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', onNavKeyDown);
        });

        // Resize listener
        window.addEventListener('resize', onResize, { passive: true });

        // Initial active state
        const initialPage = window.location.hash.replace('#', '') || 'home';
        setActiveNavItem(initialPage);

        // Scroll elevation
        wireScrollElevation();
    }

    // ── Public API ──────────────────────────────────────────────────────
    window.M3Nav = {
        init,
        setActiveNavItem,
        toggleDrawer,
        openDrawer,
        closeDrawer,
        getLayoutMode,
    };
})();
