(function () {
    'use strict';

    var STORAGE_KEY = 'm3_sidebar_collapsed';
    var ICON_MAP = {
        'home': 'home', 'accounting': 'account_balance', 'stock': 'inventory_2',
        'selling': 'storefront', 'buying': 'shopping_cart', 'hr module': 'groups',
        'human resources': 'groups', 'projects': 'folder_open', 'assets': 'business_center',
        'manufacturing': 'precision_manufacturing', 'crm': 'contacts',
        'support': 'support_agent', 'website': 'language', 'settings': 'settings',
        'build': 'construction', 'users': 'group', 'customization': 'tune',
        'integrations': 'hub', 'getting started': 'rocket_launch', 'tools': 'handyman',
        'quality': 'verified', 'erpnext settings': 'manufacturing',
        'erpnext integrations': 'hub', 'utilities': 'build', 'education': 'school',
        'healthcare': 'local_hospital', 'agriculture': 'eco', 'hospitality': 'hotel',
        'non profit': 'volunteer_activism', 'loans': 'account_balance_wallet',
        'payroll': 'payments', 'retail': 'store', 'airplane mode': 'airplanemode_active',
        'receivable': 'request_quote', 'receivables': 'request_quote',
        'payable': 'payments', 'payables': 'account_balance_wallet',
        'financial reports': 'bar_chart', 'reports': 'assessment',
        'data import and settings': 'database',
    };
    var DEFAULT_ICON = 'grid_view';
    var cachedItems = null;

    // ── Global System SVGs to M3 Icon Mapping ──
    var SYSTEM_ICON_MAP = {
        // Base Essentials
        'icon-search': 'search', 'icon-notification': 'notifications', 'icon-help': 'help',
        'icon-setting-gear': 'settings', 'icon-add': 'add', 'icon-edit': 'edit',
        'icon-delete': 'delete', 'icon-close': 'close', 'icon-close-alt': 'close',
        'icon-menu': 'menu', 'icon-refresh': 'refresh', 'icon-reload': 'refresh',
        'icon-more': 'more_horiz', 'icon-dot-horizontal': 'more_horiz', 'icon-dot-vertical': 'more_vert',
        'icon-filter': 'filter_alt', 'icon-calendar': 'calendar_today', 'icon-date': 'calendar_month',
        'icon-attachment': 'attachment', 'icon-link': 'link', 'icon-upload': 'upload', 'icon-upload-lg': 'upload',
        'icon-download': 'download', 'icon-print': 'print', 'icon-printer': 'print',
        'icon-export': 'output', 'icon-import': 'input', 'icon-mail': 'mail', 'icon-user': 'person',

        // Replies & Hearts & Comments (Communication)
        'icon-reply-all': 'reply_all', 'icon-reply': 'reply', 'icon-star': 'star',
        'icon-heart': 'favorite', 'icon-favorite': 'favorite', 'icon-check': 'check', 'icon-tick': 'done',
        'icon-warning': 'warning', 'icon-info': 'info', 'icon-error': 'error', 'icon-home': 'home',
        'icon-comment': 'comment', 'icon-chat': 'chat', 'icon-small-message': 'chat_bubble',
        // es-line-chat-alt / es-solid-chat-alt → comment (speech bubble with lines)
        'es-line-chat-alt': 'comment', 'es-solid-chat-alt': 'comment',
        'chat-alt': 'comment', 'icon-chat-alt': 'comment',
        'icon-clap': 'thumb_up', 'icon-criticize': 'thumb_down',

        // People, Assignments & Sharing
        // es-line-add-people → used in "Assigned To" and "Share" sidebar labels
        'es-line-add-people': 'group_add', 'es-solid-add-people': 'group_add',
        'add-people': 'group_add', 'icon-add-people': 'group_add',

        // Notifications
        'es-line-notifications': 'notifications', 'es-solid-notifications': 'notifications',
        'notifications': 'notifications',
        'es-line-notifications-unseen': 'notifications_active', 'es-solid-notifications-unseen': 'notifications_active',
        'notifications-unseen': 'notifications_active',
        'icon-mark-as-read': 'mark_email_read', 'mark-as-read': 'mark_email_read',

        // Chevron variants (es-line-left-chevron / es-line-right-chevron used in form navigation)
        'es-line-left-chevron': 'chevron_left', 'es-solid-left-chevron': 'chevron_left',
        'left-chevron': 'chevron_left',
        'es-line-right-chevron': 'chevron_right', 'es-solid-right-chevron': 'chevron_right',
        'right-chevron': 'chevron_right',

        // Scroll / collapse
        'icon-up-line': 'keyboard_arrow_up', 'up-line': 'keyboard_arrow_up',

        // Arrows & Carets
        'icon-arrow-down': 'keyboard_arrow_down', 'icon-arrow-up': 'keyboard_arrow_up',
        'icon-arrow-right': 'keyboard_arrow_right', 'icon-arrow-left': 'keyboard_arrow_left',
        'icon-down': 'keyboard_arrow_down', 'icon-up': 'keyboard_arrow_up',
        'icon-left': 'keyboard_arrow_left', 'icon-right': 'keyboard_arrow_right',
        'icon-small-down': 'keyboard_arrow_down', 'icon-small-up': 'keyboard_arrow_up',
        'icon-up-arrow': 'arrow_upward', 'icon-down-arrow': 'arrow_downward',
        'icon-arrow-up-right': 'north_east', 'icon-arrow-down-left': 'south_west',
        'icon-arrow-down-right': 'south_east',
        'icon-chevron-down': 'expand_more', 'icon-chevron-up': 'expand_less',
        'icon-chevron-left': 'chevron_left', 'icon-chevron-right': 'chevron_right',
        'icon-menu-collapse': 'chevron_left', 'icon-menu-expand': 'chevron_right',

        // View Types & Dashboards
        'icon-dashboard': 'dashboard', 'icon-reports': 'assessment', 'icon-report': 'analytics',
        'icon-history': 'history', 'icon-list-alt': 'list_alt', 'icon-list': 'list',
        'icon-kanban': 'view_kanban', 'icon-image-view': 'grid_view', 'icon-table': 'table_view',

        // Items, Files & Folders
        'icon-folder': 'folder', 'icon-folder-normal': 'folder', 'icon-folder-open': 'folder_open',
        'icon-folder-normal-large': 'folder', 'icon-sub-folder': 'featured_play_list',
        'folder-shared': 'folder_shared', 'shared-folder': 'folder_shared', 'folder-upload': 'drive_folder_upload',
        'icon-file': 'insert_drive_file', 'icon-small-file': 'insert_drive_file', 'icon-file-large': 'insert_drive_file',
        'icon-play': 'play_arrow', 'icon-pause': 'pause', 'icon-stop': 'stop',
        'icon-success': 'check_circle', 'icon-danger': 'cancel', 'icon-camera': 'photo_camera', 'camera': 'photo_camera',
        'icon-lock': 'lock', 'icon-unlock': 'lock_open', 'icon-clock': 'schedule', 'icon-time': 'schedule',
        'icon-logout': 'logout', 'icon-tool': 'build', 'icon-share': 'share', 'share': 'share',
        'icon-drag': 'drag_indicator', 'icon-drag-sm': 'drag_indicator',
        'icon-library': 'local_library', 'library': 'local_library',
        'icon-assign': 'assignment_ind', 'assign': 'assignment_ind',
        'icon-tag': 'sell', 'tag': 'sell',
        'select-file': 'file_open', 'attachment': 'attachment',

        // Rich Text Editor & Text
        'icon-bold': 'format_bold', 'icon-italic': 'format_italic', 'icon-underline': 'format_underlined',
        'bold': 'format_bold', 'italic': 'format_italic', 'underline': 'format_underlined',
        'icon-code': 'code', 'icon-image': 'image', 'icon-video': 'videocam',
        'icon-align-left': 'format_align_left', 'icon-align-center': 'format_align_center',
        'icon-align-right': 'format_align_right', 'icon-align-justify': 'format_align_justify',
        'icon-ordered-list': 'format_list_numbered', 'icon-list-ul': 'format_list_bulleted',
        'icon-link-url': 'link', 'icon-quote': 'format_quote', 'icon-clean': 'clear_all',
        'icon-text': 'format_size', 'icon-header': 'title', 'icon-header-1': 'format_h1',
        'icon-header-2': 'format_h2', 'icon-header-3': 'format_h3', 'icon-header-4': 'format_h4',
        'icon-header-5': 'format_h5', 'icon-header-6': 'format_h6', 'text-cursor': 'text_fields',
        'color-wheel': 'palette',

        // Sorting, Selecting & Misc
        'icon-sort': 'sort', 'icon-sort-ascending': 'arrow_upward', 'icon-sort-descending': 'arrow_downward',
        'icon-select': 'expand_more', 'select': 'expand_more', 'icon-checkbox-active': 'check_box',
        'icon-save': 'save', 'icon-send': 'send', 'icon-telephone': 'phone',
        'icon-mic': 'mic', 'icon-eye-open': 'visibility', 'icon-eye-closed': 'visibility_off',
        'icon-builder': 'design_services', 'icon-solid-info': 'info', 'icon-solid-warning': 'warning',
        'icon-solid-error': 'error', 'icon-solid-success': 'check_circle',
        'icon-expand': 'fullscreen', 'icon-collapse': 'fullscreen_exit',
        'icon-expand-alt': 'open_in_full', 'icon-shrink': 'close_fullscreen',
        'icon-branch': 'account_tree', 'icon-device': 'computer', 'icon-computer': 'computer',
        'icon-my-device': 'computer', 'my-device': 'computer', 'device': 'computer',
        'file-upload': 'upload_file', 'preview': 'preview'
    };

    function replaceSystemIcons() {
        document.querySelectorAll('svg.icon:not(.m3-processed), svg.es-icon:not(.m3-processed)').forEach(function (svg) {
            svg.classList.add('m3-processed');
            var useNode = svg.querySelector('use');
            if (useNode) {
                var href = useNode.getAttribute('href');
                if (href && href.startsWith('#')) {
                    var rawId = href.substring(1);
                    // Frappe uses 'icon-', 'es-line-', or 'es-solid-'
                    // We map back to our 'icon-xxx' dictionary keys
                    var normalizedId = rawId.startsWith('es-line-') ? rawId.substring(8) :
                        rawId.startsWith('es-solid-') ? rawId.substring(9) :
                            rawId.startsWith('icon-') ? rawId.substring(5) : rawId;

                    var m3IconName = SYSTEM_ICON_MAP[rawId] ||
                        SYSTEM_ICON_MAP['icon-' + normalizedId] ||
                        SYSTEM_ICON_MAP[normalizedId];

                    if (m3IconName) {
                        svg.style.display = 'none';
                        var span = document.createElement('span');
                        var baseClasses = (svg.getAttribute('class') || '').replace('m3-processed', '').replace('es-icon', '').replace('es-line', '').replace('es-solid', '').trim();
                        span.className = 'material-symbols-rounded m3-system-icon ' + baseClasses;
                        span.textContent = m3IconName;
                        svg.insertAdjacentElement('afterend', span);
                    }
                }
            }
        });
    }

    // ── Collapse State ──
    function isCollapsed() { return localStorage.getItem(STORAGE_KEY) === 'true'; }
    function setCollapsed(c) {
        document.body.classList.toggle('sidebar-collapsed', c);
        localStorage.setItem(STORAGE_KEY, String(c));
    }
    function toggleSidebar() {
        if (window.innerWidth <= 767) {
            document.body.classList.toggle('mobile-sidebar-open');
        } else {
            setCollapsed(!document.body.classList.contains('sidebar-collapsed'));
        }
    }

    // ── Extract sidebar items from Frappe's desk-sidebar OR Custom Sidebar Config ──
    function extractItems() {
        if (window.frappe && frappe.boot && frappe.boot.m3_theme_settings && frappe.boot.m3_theme_settings.custom_sidebar && frappe.boot.m3_theme_settings.custom_sidebar.length > 0) {
            var custItems = [];
            frappe.boot.m3_theme_settings.custom_sidebar.forEach(function (c) {
                var href = c.link_type === 'URL' ? c.link_to : '/app/' + c.link_to.toLowerCase().replace(/ /g, '-');
                custItems.push({ label: c.title, href: href, iconOverride: c.icon });
            });
            return custItems;
        }
        var sb = document.querySelector('.desk-sidebar');
        if (!sb) return null;
        var items = [];
        sb.querySelectorAll('.desk-sidebar-item').forEach(function (el) {
            var a = el.querySelector('a.item-anchor');
            var l = el.querySelector('.sidebar-item-label');
            if (a && l) items.push({ label: l.textContent.trim(), href: a.getAttribute('href') || '#' });
        });
        return items.length ? items : null;
    }

    // ── Build sidebar HTML (with toggle button header) ──
    function buildHTML(items) {
        var h = '<div class="m3-sidebar-header"><button class="m3-sidebar-toggle-btn"><span class="material-symbols-rounded">menu</span></button></div>';
        items.forEach(function (it) {
            var icon = it.iconOverride || ICON_MAP[it.label.toLowerCase()] || DEFAULT_ICON;
            // Place data-label securely on the container so our hide selectors can target it easily!
            h += '<div class="sidebar-item-container" data-label="' + it.label + '"><div class="desk-sidebar-item"><a class="item-anchor" href="' + it.href +
                '"><div class="sidebar-item-icon"><span class="material-symbols-rounded">' +
                icon + '</span></div><span class="sidebar-item-label">' +
                it.label + '</span></a></div></div>';
        });
        return h;
    }

    // ── Ensure fixed sidebar exists ──
    function ensureSidebar() {
        var fresh = extractItems();
        if (fresh) {
            cachedItems = fresh;
            try { localStorage.setItem('m3_sidebar_items', JSON.stringify(fresh)); } catch (e) { }
        }
        if (!cachedItems) {
            try { var s = localStorage.getItem('m3_sidebar_items'); if (s) cachedItems = JSON.parse(s); } catch (e) { }
        }
        if (!cachedItems) return;

        var el = document.getElementById('m3-fixed-sidebar');
        if (!el) {
            el = document.createElement('div');
            el.id = 'm3-fixed-sidebar';
            document.body.appendChild(el);
        }

        var newHTML = buildHTML(cachedItems);

        // CRITICAL BUG FIX: Only rewrite the DOM if the sidebar HTML has actually changed!
        // Prevents the observer from destroying the <a> tag precisely when a user hovers/clicks it.
        if (el.dataset.m3HtmlCache !== newHTML) {
            el.innerHTML = newHTML;
            el.dataset.m3HtmlCache = newHTML;

            // Setup mobile sidebar closure. DO NOT globally e.preventDefault() here!
            // We let Frappe's native SPA router seamlessly handle the anchor jump.
            el.querySelectorAll('.desk-sidebar-item a').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (window.innerWidth <= 767) {
                        document.body.classList.remove('mobile-sidebar-open');
                    }
                });
            });
        }

        applyActive(el);

        // Ensure backdrop exists for mobile
        var backdrop = document.getElementById('m3-mobile-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'm3-mobile-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', function (e) {
                document.body.classList.remove('mobile-sidebar-open');
            });
        }
    }

    // ── Active state ──
    function applyActive(container) {
        if (!container) return;
        var route = (window.location.pathname.replace('/app/', '').split('/')[0] || 'home').toLowerCase();
        container.querySelectorAll('.desk-sidebar-item').forEach(function (item) {
            var a = item.querySelector('a.item-anchor');
            if (!a) return;
            var r = (a.getAttribute('href') || '').replace('/app/', '').split('/')[0] || '';
            item.classList.toggle('selected',
                r === route || (route === 'home' && (r === '' || r === 'home')));
        });
    }

    // ── Pill Toggle for Form/List Sidebar ──
    function ensureFormSidebarToggle() {
        // Iterate over all active/inactive page containers (Frappe caches previous pages in the DOM)
        document.querySelectorAll('.page-container').forEach(function (page) {
            var ls = page.querySelector('.layout-side-section');
            if (!ls || ls.querySelector('.desk-sidebar')) return;

            // Ensure it has basic M3 styling
            ls.classList.add('m3-internal-sidebar');

            // Find the page actions container (top right) to inject the toggle
            var pageActions = page.querySelector('.page-actions');
            if (!pageActions) return;

            // Check if our custom toggle already exists in this specific page
            var existingBtn = pageActions.querySelector('.m3-pill-sidebar-toggle');
            if (existingBtn) return;

            // Create an icon-only M3 Button
            var btn = document.createElement('button');
            btn.className = 'btn m3-pill-sidebar-toggle active';
            btn.innerHTML = '<span class="material-symbols-rounded">view_sidebar</span>';
            btn.title = 'Toggle Sidebar';

            // Append to the absolute end of page-actions
            pageActions.appendChild(btn);

            // Toggle logic
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (ls.style.display === 'none') {
                    ls.style.display = 'block';
                    btn.classList.add('active');
                    document.body.classList.add('form-sidebar-visible');
                } else {
                    ls.style.display = 'none';
                    btn.classList.remove('active');
                    document.body.classList.remove('form-sidebar-visible');
                }
            });
        });
    }

    // ── Check Current Sidebar Visibility for CSS Triggers ──
    function checkCurrentSidebar() {
        var activePage = document.querySelector('.page-container:not([style*="display: none"]) .layout-side-section');
        var isVisible = activePage && activePage.style.display !== 'none' && !activePage.querySelector('.desk-sidebar');

        if (isVisible) {
            document.body.classList.add('form-sidebar-visible');
        } else {
            document.body.classList.remove('form-sidebar-visible');
        }
        // Search bar is now centred purely via CSS (position:absolute; left:50%; transform:translate(-50%,-50%))
        // No JS right-position calculation needed any more.
    }

    // ── Sync "Liked by Me" header button with actual filter state ──
    // When the filter is applied via the filter panel (not by clicking the heart icon),
    // Frappe updates the URL with _liked_by param but does NOT toggle .active on
    // .list-liked-by-me. This function bridges that gap.
    function syncLikedByMeButton() {
        var btn = document.querySelector('.list-liked-by-me');
        if (!btn) return;

        // Check the URL query string — _liked_by param is present when filter is ON
        var params = new URLSearchParams(window.location.search);
        var isFilterActive = params.has('_liked_by');

        if (isFilterActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }

    // ── Patch Toggle Buttons in Page Head (Only for M3 Fixed Sidebar) ──
    function patchToggles() {
        // Patch all toggles across Frappe's cached SPA page-containers!
        document.querySelectorAll('.sidebar-toggle-btn').forEach(function (btn) {
            if (btn._m3) return;

            btn.innerHTML = '<span class="material-symbols-rounded">menu</span>';
            btn.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                toggleSidebar();
                return false;
            }, true);
            btn._m3 = true;
        });
    }

    // ── Desk-only guard: don't inject M3 sidebar on website/portal pages ──
    function isDeskPage() {
        var path = window.location.pathname;
        // Frappe Desk lives under /app/
        // Everything else (/, /about, /blog, /shop, /me, etc.) is the website.
        return path === '/app' || path.indexOf('/app/') === 0;
    }

    // ── Remove/hide the fixed sidebar when not on desk ──
    function teardownSidebar() {
        document.body.classList.remove('m3-desk');
        var el = document.getElementById('m3-fixed-sidebar');
        if (el) el.style.display = 'none';
        var bd = document.getElementById('m3-mobile-backdrop');
        if (bd) bd.style.display = 'none';
    }

    // ── Init ──
    function init() {
        if (!isDeskPage()) {
            teardownSidebar();
            return; // Nothing else to do on website pages
        }
        // Mark the body so CSS scoping works
        document.body.classList.add('m3-desk');
        if (isCollapsed()) document.body.classList.add('sidebar-collapsed');
        replaceSystemIcons();
        ensureSidebar();
        patchToggles();
        ensureFormSidebarToggle();
        checkCurrentSidebar();
        syncLikedByMeButton();
    }

    // ── Observer (catches new toggle buttons & fresh sidebar data) ──
    var obsStarted = false;
    function startObs() {
        if (obsStarted) return;
        obsStarted = true;

        // Fast observer for system icons (near instant replace)
        var iconTimer = null;
        new MutationObserver(function () {
            if (!iconTimer) {
                iconTimer = setTimeout(function () {
                    replaceSystemIcons();
                    iconTimer = null;
                }, 20);
            }
        }).observe(document.body, { childList: true, subtree: true });

        // Slower observer for sidebar layout logic
        var t = null;
        new MutationObserver(function () {
            clearTimeout(t);
            t = setTimeout(function () {
                if (!isDeskPage()) { teardownSidebar(); return; }
                ensureSidebar(); // Now safely cached, won't thrash DOM!
                patchToggles();
                ensureFormSidebarToggle();
                checkCurrentSidebar();
                syncLikedByMeButton();
            }, 50); // Speed up alignment tick on observe
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    // Bind window resize to keep it perfectly snapped
    window.addEventListener('resize', function () {
        checkCurrentSidebar();
    });

    // ── Apply custom Theme Settings from Boot ──
    function applyBootThemeSettings() {
        if (typeof frappe === 'undefined' || !frappe.boot || !frappe.boot.m3_theme_settings) return;

        var doc = frappe.boot.m3_theme_settings;
        var root = document.documentElement;

        // Colors
        function hexToRgbStr(hex) {
            if (!hex || hex.length < 7) return null;
            var c = hex.substring(1).split('');
            if (c.length == 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(', ');
        }

        if (doc.primary_color) {
            root.style.setProperty("--m3-primary", doc.primary_color);
            var rgb = hexToRgbStr(doc.primary_color);
            if (rgb) root.style.setProperty("--m3-primary-rgb", rgb);
        }
        if (doc.secondary_color) {
            root.style.setProperty("--m3-secondary", doc.secondary_color);
            var rgb = hexToRgbStr(doc.secondary_color);
            if (rgb) root.style.setProperty("--m3-secondary-rgb", rgb);
        }
        if (doc.surface_color) {
            root.style.setProperty("--m3-surface", doc.surface_color);
            var rgb = hexToRgbStr(doc.surface_color);
            if (rgb) root.style.setProperty("--m3-surface-rgb", rgb);
        }
        if (doc.background_color) {
            root.style.setProperty("--m3-background", doc.background_color);
            var rgb = hexToRgbStr(doc.background_color);
            if (rgb) root.style.setProperty("--m3-background-rgb", rgb);
        }
        if (doc.error_color) {
            root.style.setProperty("--m3-error", doc.error_color);
            var rgb = hexToRgbStr(doc.error_color);
            if (rgb) root.style.setProperty("--m3-error-rgb", rgb);
        }
        if (doc.on_primary_color) root.style.setProperty("--m3-on-primary", doc.on_primary_color);

        // Typography
        var fontMap = {
            "Readex Pro": "'Readex Pro', sans-serif",
            "Inter": "'Inter', sans-serif",
            "Roboto": "'Roboto', sans-serif",
            "Noto Sans": "'Noto Sans', sans-serif",
            "Poppins": "'Poppins', sans-serif",
            "Outfit": "'Outfit', sans-serif",
            "DM Sans": "'DM Sans', sans-serif",
            "Plus Jakarta Sans": "'Plus Jakarta Sans', sans-serif",
            "IBM Plex Sans": "'IBM Plex Sans', sans-serif",
            "System Default": "system-ui, -apple-system, sans-serif",
        };
        if (doc.font_family && fontMap[doc.font_family]) {
            root.style.setProperty("--font-family", fontMap[doc.font_family]);
        }
        if (doc.base_font_size) {
            root.style.setProperty("font-size", doc.base_font_size + "px");
        }

        // Layout
        if (doc.border_radius) root.style.setProperty("--border-radius-md", doc.border_radius + "px");
        if (doc.navbar_height) root.style.setProperty("--navbar-height", doc.navbar_height + "px");
        if (doc.sidebar_width) root.style.setProperty("--sidebar-width", doc.sidebar_width + "px");
        if (doc.sidebar_rail_width) root.style.setProperty("--sidebar-rail-width", doc.sidebar_rail_width + "px");

        let dynamicCSS = "";

        // Headings & Fonts
        if (doc.heading_font_family && doc.heading_font_family !== "Same as Body" && fontMap[doc.heading_font_family]) {
            dynamicCSS += `h1, h2, h3, h4, h5, h6, .text-heading, .card-title { font-family: ${fontMap[doc.heading_font_family]} !important; }\n`;
        }
        if (doc.font_weight_body) {
            root.style.setProperty("font-weight", doc.font_weight_body); // applied to body usually
        }

        // Toggles - Navbar
        if (!doc.show_search_bar) dynamicCSS += `.navbar .search-bar, .navbar-form.search-bar { display: none !important; }\n`;
        if (!doc.show_notification_bell) dynamicCSS += `.navbar .notification-list, .navbar .dropdown-message, .notifications-icon { display: none !important; }\n`;
        if (!doc.show_help_menu) dynamicCSS += `.navbar .dropdown-help { display: none !important; }\n`;
        if (!doc.show_app_switcher) dynamicCSS += `.navbar .app-switcher-menu, .navbar-brand { display: none !important; }\n`;

        // Toggles - Profile Menu
        if (!doc.show_my_profile_link) dynamicCSS += `.dropdown-navbar-user a[href="/app/user-profile"] { display: none !important; }\n`;
        if (!doc.show_my_settings_link) dynamicCSS += `.dropdown-navbar-user a[href="/app/user"] { display: none !important; }\n`;
        if (!doc.show_session_defaults_link) dynamicCSS += `.dropdown-navbar-user button[onclick*="session_default"] { display: none !important; }\n`;
        if (!doc.show_keyboard_shortcuts_link) dynamicCSS += `.dropdown-navbar-user button[onclick*="show_shortcuts"] { display: none !important; }\n`;
        if (!doc.show_switch_to_desk_link) dynamicCSS += `.dropdown-navbar-user a[href="/app"] { display: none !important; }\n`;
        if (!doc.show_switch_to_website_link) dynamicCSS += `.dropdown-navbar-user button[onclick*="view_website"], .dropdown-navbar-user a[href="/"] { display: none !important; }\n`;

        // Toggles - Sidebar
        if (!doc.sidebar_show_module_icons) dynamicCSS += `body #m3-fixed-sidebar .desk-sidebar-item .sidebar-item-icon { display: none !important; } body #m3-fixed-sidebar .item-anchor { justify-content: flex-start !important; padding-left: 20px !important; }\n`;
        if (!doc.sidebar_show_module_names) dynamicCSS += `body:not(.sidebar-collapsed) #m3-fixed-sidebar .sidebar-item-label { display: none !important; }\n`;
        if (!doc.sidebar_show_favorites) dynamicCSS += `body #m3-fixed-sidebar [data-label="Favorites" i] { display: none !important; }\n`;

        // Compact Density Enforcements
        if (doc.compact_density) {
            dynamicCSS += `
                :root { 
                    --padding-md: 8px !important; 
                    --padding-lg: 12px !important; 
                    --margin-md: 8px !important;
                }
                .layout-main-section { padding: 8px 12px !important; margin-top: 12px !important; }
                .card { margin-bottom: 12px !important; }
                .form-control { height: 32px !important; padding-top: 4px !important; padding-bottom: 4px !important; }
            `;
        }

        if (doc.workspace_bg_color) {
            dynamicCSS += `body.m3-desk, #page-desktop { background: ${doc.workspace_bg_color} !important; }\n`;
        }

        // Sidebar Mode Enforcements
        if (doc.sidebar_mode === "Rail") {
            localStorage.setItem('m3_sidebar_collapsed', '1');
            dynamicCSS += `.m3-sidebar-toggle-btn { display: none !important; }\n`; // hide completely if forced Rail
        } else if (doc.sidebar_mode === "Drawer") {
            // we let the user toggle freely, do nothing specific
        } else if (doc.sidebar_mode === "Hidden") {
            dynamicCSS += `.m3-fixed-sidebar, .m3-sidebar-toggle-btn { display: none !important; }\n.layout-main, body.m3-desk .page-container { margin-left: 0 !important; width: 100% !important; max-width: 100% !important; }\n`;
        }

        // Custom Logo Replacement
        if (doc.custom_logo) {
            dynamicCSS += `
                .navbar-brand img, .app-logo { display: none !important; }
                .navbar-brand { 
                    background-image: url('${doc.custom_logo}'); 
                    background-size: contain; 
                    background-repeat: no-repeat; 
                    background-position: center left; 
                    height: ${doc.custom_logo_height || 32}px !important;
                    min-width: 120px;
                    display: inline-block !important; /* ensure it's visible if app switcher is hidden */
                }
            `;
        }

        // Apply Login Page Overrides if we are on the login screen
        if (window.location.pathname.startsWith('/login')) {
            if (doc.login_background_image) {
                dynamicCSS += `body.login-page { background: url('${doc.login_background_image}') no-repeat center center fixed !important; background-size: cover !important; }\n`;
            }
            if (doc.login_overlay_opacity) {
                dynamicCSS += `body.login-page::after { content: ""; position: absolute; inset: 0; background: rgba(0,0,0,${doc.login_overlay_opacity}); z-index: 0; pointer-events: none; }\n`;
                dynamicCSS += `.for-login { position: relative; z-index: 10; box-shadow: 0 4px 24px rgba(0,0,0,0.3) !important; background: var(--card-bg) !important; }\n`;
            }
            if (doc.login_logo) {
                dynamicCSS += `.login-content .app-logo { content: url('${doc.login_logo}') !important; width: auto !important; height: auto !important; max-height: 80px !important; margin: 0 auto; }\n`;
            }
            if (!doc.show_social_login) dynamicCSS += `.social-logins { display: none !important; }\n`;
            if (!doc.show_email_password_login) dynamicCSS += `.form-login { display: none !important; }\n`;

            // Adjust texts if configured
            setTimeout(() => {
                if (doc.login_page_title) {
                    var h1 = document.querySelector('.login-content .page-head h1') || document.querySelector('.login-content h1:not(.app-logo)');
                    if (h1) h1.innerText = doc.login_page_title;
                }
                if (doc.login_page_subtitle) {
                    var p = document.querySelector('.login-content .page-head p');
                    if (p) {
                        p.innerText = doc.login_page_subtitle;
                    } else if (doc.login_page_title) {
                        // Create a subtitle if none existed under the new title (often there is an h1 but no p)
                        var dest = document.querySelector('.login-content .page-head h1');
                        if (dest) dest.insertAdjacentHTML('afterend', `<p class="mt-2 text-muted">${doc.login_page_subtitle}</p>`);
                    }
                }
                if (doc.login_footer_text) {
                    var parent = document.querySelector('.login-content');
                    if (parent) parent.insertAdjacentHTML('beforeend', `<div class="mt-4 text-center text-muted" style="font-size: 13px;">${doc.login_footer_text}</div>`);
                }
            }, 100);
        }

        // Mount dynamic styles safely
        var dynStyle = document.getElementById('m3-theme-dynamic-css');
        if (!dynStyle) {
            dynStyle = document.createElement('style');
            dynStyle.id = 'm3-theme-dynamic-css';
            document.head.appendChild(dynStyle);
        }
        dynStyle.innerHTML = dynamicCSS;

        // Custom CSS
        if (doc.inject_custom_css && doc.custom_css) {
            var styleEl = document.getElementById('m3-theme-custom-css');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'm3-theme-custom-css';
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = doc.custom_css;
        }

        // Custom JS (Load exactly once)
        if (doc.inject_custom_js && doc.custom_js && !document.getElementById('m3-theme-custom-js')) {
            var scriptEl = document.createElement('script');
            scriptEl.id = 'm3-theme-custom-js';
            scriptEl.innerHTML = doc.custom_js;
            document.head.appendChild(scriptEl);
        }
    }

    // Attempt to apply boot settings instantly (reduces flash)
    if (typeof frappe !== 'undefined' && frappe.boot && frappe.boot.m3_theme_settings) {
        applyBootThemeSettings();
    } else {
        // Fallback for Website or Login pages where frappe.boot isn't fully loaded with backend variables yet
        fetch('/api/method/m3_theme.m3_theme.doctype.theme_settings.theme_settings.get_theme_settings')
            .then(res => res.json())
            .then(res => {
                if (res && res.message) {
                    window.frappe = window.frappe || {};
                    window.frappe.boot = window.frappe.boot || {};
                    window.frappe.boot.m3_theme_settings = res.message;
                    applyBootThemeSettings();
                }
            }).catch(() => { });
    }

    // ── Startup ──
    function go() {
        applyBootThemeSettings(); // Re-run just in case it loaded late
        setTimeout(function () { init(); startObs(); }, 300);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();

    // ── Global Event Delegation for Toggle Buttons ──
    document.body.addEventListener('click', function (e) {
        var tbtn = e.target.closest('.m3-sidebar-toggle-btn');
        if (tbtn) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            toggleSidebar();
        }
    }, true);

    // ── SPA navigation ──
    if (typeof frappe !== 'undefined' && frappe.router && frappe.router.on) {
        frappe.router.on('change', function () {
            setTimeout(function () {
                if (!isDeskPage()) { teardownSidebar(); return; }
                replaceSystemIcons(); ensureSidebar(); patchToggles(); ensureFormSidebarToggle(); checkCurrentSidebar();
                syncLikedByMeButton();
            }, 400);
        });
    }
    window.addEventListener('popstate', function () {
        setTimeout(function () {
            if (!isDeskPage()) { teardownSidebar(); return; }
            replaceSystemIcons();
            var el = document.getElementById('m3-fixed-sidebar');
            if (el) applyActive(el);
            patchToggles();
            ensureFormSidebarToggle();
            checkCurrentSidebar();
            syncLikedByMeButton();
        }, 400);
    });
})();
