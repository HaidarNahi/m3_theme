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

    // ── Extract sidebar items from Custom Sidebar Config OR Frappe boot workspaces ──
    function extractItems() {
        if (!window.frappe || !frappe.boot) return null;

        if (frappe.boot.m3_theme_settings && frappe.boot.m3_theme_settings.sidebar_type === 'Custom Sidebar' && frappe.boot.m3_theme_settings.custom_sidebar_data) {
            var custom_data = [];
            try { custom_data = JSON.parse(frappe.boot.m3_theme_settings.custom_sidebar_data); } catch (e) { }

            if (custom_data.length > 0) {
                var custItems = [];
                custom_data.forEach(function (c) {
                    var href = '';
                    if (c.link_type === 'URL') {
                        href = c.link_to;
                    } else if (c.link_type === 'Report') {
                        href = '/app/query-report/' + encodeURIComponent(c.link_to);
                    } else if (c.link_type === 'Dashboard') {
                        href = '/app/dashboard-view/' + encodeURIComponent(c.link_to);
                    } else {
                        href = '/app/' + c.link_to.toLowerCase().replace(/ /g, '-');
                    }
                    custItems.push({ label: c.title, href: href, iconOverride: c.icon, iconFilled: c.icon_filled });
                });
                return custItems;
            }
        }

        // If Default Sidebar, use Frappe's backend boot data directly to bypass DOM race conditions!
        if (frappe.boot.allowed_workspaces && frappe.boot.allowed_workspaces.length > 0) {
            var items = [];
            frappe.boot.allowed_workspaces.forEach(function (ws) {
                if (ws.is_hidden) return;
                items.push({
                    label: ws.title || ws.name,
                    href: '/app/' + (ws.name || '').toLowerCase().replace(/ /g, '-')
                });
            });
            return items.length ? items : null;
        }

        return null;
    }

    // ── Build sidebar HTML (with toggle button header) ──
    function buildHTML(items) {
        var h = '<div class="m3-sidebar-header"><button class="m3-sidebar-toggle-btn"><span class="material-symbols-rounded">menu</span></button></div>';
        items.forEach(function (it) {
            var icon = it.iconOverride || ICON_MAP[it.label.toLowerCase()] || DEFAULT_ICON;
            var fillCss = it.iconFilled ? ' font-variation-settings: \\"FILL\\" 1;' : '';
            // Place data-label securely on the container so our hide selectors can target it easily!
            h += '<div class="sidebar-item-container" data-label="' + it.label + '"><div class="desk-sidebar-item"><a class="item-anchor" href="' + it.href +
                '"><div class="sidebar-item-icon"><span class="material-symbols-rounded" style="' + fillCss + '">' +
                icon + '</span></div><span class="sidebar-item-label">' +
                it.label + '</span></a></div></div>';
        });
        return h;
    }

    // ── Ensure fixed sidebar exists ──
    function ensureSidebar() {
        var fresh = extractItems();
        var currentType = (window.frappe && frappe.boot && frappe.boot.m3_theme_settings && frappe.boot.m3_theme_settings.sidebar_type) ? frappe.boot.m3_theme_settings.sidebar_type : 'Default Sidebar';

        if (fresh) {
            cachedItems = fresh;
            try {
                localStorage.setItem('m3_sidebar_items', JSON.stringify(fresh));
                localStorage.setItem('m3_sidebar_type', currentType);
            } catch (e) { }
        }
        if (!cachedItems) {
            try {
                var cachedType = localStorage.getItem('m3_sidebar_type');
                // Only load cache if the requested sidebar type matches what is in local storage, preventing cross-contamination!
                if (!cachedType || cachedType === currentType) {
                    var s = localStorage.getItem('m3_sidebar_items');
                    if (s) cachedItems = JSON.parse(s);
                } else {
                    // Type changed! Cache is invalid, clear it!
                    localStorage.removeItem('m3_sidebar_items');
                    localStorage.removeItem('m3_sidebar_type');
                    var old_sidebar = document.getElementById('m3-fixed-sidebar');
                    if (old_sidebar) old_sidebar.remove();
                }
            } catch (e) { }
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
        injectCustomNavbarAndProfile();
    }

    function injectCustomNavbarAndProfile() {
        if (!window.frappe || !frappe.boot || !frappe.boot.m3_theme_settings) return;
        var doc = frappe.boot.m3_theme_settings;

        if (doc.external_link_url && doc.external_link_label) {
            var ul = document.querySelector('.navbar .navbar-nav.navbar-right') || document.querySelector('.navbar .navbar-right') || document.querySelector('.dropdown-navbar-user') ? document.querySelector('.dropdown-navbar-user').closest('ul') : null;
            if (ul) {
                var existingLi = ul.querySelector('.m3-external-link');
                if (!existingLi || existingLi.getAttribute('data-href') !== doc.external_link_url || existingLi.getAttribute('data-label') !== doc.external_link_label) {
                    if (existingLi) existingLi.remove();
                    var li = document.createElement('li');
                    li.className = 'm3-external-link nav-item';
                    li.setAttribute('data-href', doc.external_link_url);
                    li.setAttribute('data-label', doc.external_link_label);
                    li.innerHTML = `<a class="nav-link" href="${doc.external_link_url}" target="_blank" data-bypass="true" rel="noopener noreferrer" title="${doc.external_link_label}" style="display:flex; align-items:center; gap:4px; font-weight: 500; font-size: 13px;">${doc.external_link_label}</a>`;

                    var helpParent = ul.querySelector('.dropdown-help');
                    var profileParent = ul.querySelector('.dropdown-navbar-user');

                    if (helpParent) {
                        ul.insertBefore(li, helpParent);
                    } else if (profileParent) {
                        ul.insertBefore(li, profileParent);
                    } else {
                        ul.insertBefore(li, ul.lastElementChild);
                    }
                }
            }
        }

        // Language Switcher Injection
        if (doc.language_switcher && doc.language_switcher.length > 0) {
            var ul = document.querySelector('.navbar .navbar-nav.navbar-right') || document.querySelector('.navbar .navbar-right') || document.querySelector('.dropdown-navbar-user')?.closest('ul');
            if (ul) {
                var currentLang = (frappe.boot && frappe.boot.lang) ? frappe.boot.lang : 'en';
                var currentLangLabel = currentLang.toUpperCase();
                if (frappe.boot && frappe.boot.lang_dict) {
                    for (var name in frappe.boot.lang_dict) {
                        if (frappe.boot.lang_dict[name] === currentLang) {
                            currentLangLabel = name;
                            break;
                        }
                    }
                }

                var optionsHtml = doc.language_switcher.map(row => {
                    var label = row.language.toUpperCase();
                    if (frappe.boot && frappe.boot.lang_dict) {
                        for (var name in frappe.boot.lang_dict) {
                            if (frappe.boot.lang_dict[name] === row.language) {
                                label = name;
                                break;
                            }
                        }
                    }
                    var activeClass = (row.language === currentLang) ? "active" : "";
                    return `<li><a href="#" class="dropdown-item m3-lang-option ${activeClass}" data-lang="${row.language}" onclick="return false;">${label}</a></li>`;
                }).join('');

                var existingLangSelect = ul.querySelector('.m3-lang-switcher .dropdown-menu');
                if (!existingLangSelect || existingLangSelect.innerHTML.replace(/\s/g, '') !== optionsHtml.replace(/\s/g, '')) {
                    ul.querySelectorAll('.m3-lang-switcher').forEach(el => el.remove());
                    var lang_li = document.createElement('li');
                    lang_li.className = 'm3-lang-switcher nav-item dropdown dropdown-language';

                    lang_li.innerHTML = `
                        <a href="#" class="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="display:flex; align-items:center; gap:6px; font-weight: 500; font-size: 13px;">
                            <span>${currentLangLabel}</span>
                            <svg class="icon icon-xs" style="width: 12px; height: 12px; fill: currentColor;"><use href="#icon-down"></use></svg>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-right" role="menu">
                            ${optionsHtml}
                        </ul>
                    `;

                    lang_li.querySelectorAll('.m3-lang-option').forEach(opt => {
                        opt.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var new_lang = this.getAttribute('data-lang');
                            if (new_lang && new_lang !== currentLang) {
                                frappe.call({
                                    method: "frappe.client.set_value",
                                    args: { doctype: "User", name: frappe.session.user, fieldname: "language", value: new_lang },
                                    callback: function () { window.location.reload(); }
                                });
                            }
                        });
                    });

                    var profileParent = ul.querySelector('.dropdown-navbar-user');
                    if (profileParent) {
                        ul.insertBefore(lang_li, profileParent);
                    } else {
                        ul.insertBefore(lang_li, ul.lastElementChild);
                    }
                }
            }
        }
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
                injectCustomNavbarAndProfile();
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

        // Color Scheme Application
        if (doc.color_scheme === 'Dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (doc.color_scheme === 'Light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }

        // Color Palettes
        var palettes = {
            "Ocean Blue (Light)": {
                "--m3-primary": "#0061A4", "--m3-primary-rgb": "0, 97, 164",
                "--m3-surface": "#FDFBFF", "--m3-surface-rgb": "253, 251, 255",
                "--m3-surface-container": "#F1F4FA", "--m3-surface-container-high": "#EBEFF5",
                "--m3-background": "#FDFBFF", "--m3-background-rgb": "253, 251, 255",
                "--m3-on-primary": "#FFFFFF", "--m3-error": "#BA1A1A",
                "--m3-on-surface": "#1A1C1E", "--m3-on-surface-variant": "#43474E"
            },
            "Emerald (Light)": {
                "--m3-primary": "#006C4C", "--m3-primary-rgb": "0, 108, 76",
                "--m3-surface": "#FBFDF9", "--m3-surface-rgb": "251, 253, 249",
                "--m3-surface-container": "#F0F5EE", "--m3-surface-container-high": "#EAEFE8",
                "--m3-background": "#FBFDF9", "--m3-background-rgb": "251, 253, 249",
                "--m3-on-primary": "#FFFFFF", "--m3-error": "#BA1A1A",
                "--m3-on-surface": "#191C1A", "--m3-on-surface-variant": "#404943"
            },
            "Amethyst (Dark)": {
                "--m3-primary": "#D0BCFF", "--m3-primary-rgb": "208, 188, 255",
                "--m3-surface": "#1C1B1F", "--m3-surface-rgb": "28, 27, 31",
                "--m3-surface-container": "#211F26", "--m3-surface-container-high": "#2B2930",
                "--m3-background": "#1C1B1F", "--m3-background-rgb": "28, 27, 31",
                "--m3-on-primary": "#381E72", "--m3-error": "#F2B8B5",
                "--m3-on-surface": "#E6E1E5", "--m3-on-surface-variant": "#CAC4D0"
            },
            "Obsidian (Dark)": {
                "--m3-primary": "#A8C7FA", "--m3-primary-rgb": "168, 199, 250",
                "--m3-surface": "#111114", "--m3-surface-rgb": "17, 17, 20",
                "--m3-surface-container": "#1E1E20", "--m3-surface-container-high": "#282A2C",
                "--m3-background": "#111114", "--m3-background-rgb": "17, 17, 20",
                "--m3-on-primary": "#062E6F", "--m3-error": "#F2B8B5",
                "--m3-on-surface": "#E3E2E6", "--m3-on-surface-variant": "#C4C6D0"
            }
        };

        if (doc.color_palette && palettes[doc.color_palette]) {
            var p = palettes[doc.color_palette];
            Object.keys(p).forEach(k => {
                root.style.setProperty(k, p[k]);
            });
        }

        // Typography (With Google Fonts injection)
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
        var gFontQueries = {
            "Readex Pro": "Readex+Pro:wght@300;400;500;600;700",
            "Inter": "Inter:wght@300;400;500;600;700",
            "Roboto": "Roboto:wght@300;400;500;700",
            "Noto Sans": "Noto+Sans:wght@300;400;500;600;700",
            "Poppins": "Poppins:wght@300;400;500;600;700",
            "Outfit": "Outfit:wght@300;400;500;600;700",
            "DM Sans": "DM+Sans:wght@300;400;500;700",
            "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@300;400;500;600;700",
            "IBM Plex Sans": "IBM+Plex+Sans:wght@300;400;500;600;700"
        };

        if (doc.font_family && gFontQueries[doc.font_family]) {
            let fontUrl = `https://fonts.googleapis.com/css2?family=${gFontQueries[doc.font_family]}&display=swap`;
            if (!document.getElementById('m3-google-fonts')) {
                var flink = document.createElement('link');
                flink.id = 'm3-google-fonts';
                flink.rel = 'stylesheet';
                flink.href = fontUrl;
                document.head.appendChild(flink);
            } else {
                document.getElementById('m3-google-fonts').href = fontUrl;
            }
        }

        if (doc.font_family && fontMap[doc.font_family]) {
            root.style.setProperty("--font-family", fontMap[doc.font_family]);
        }

        // Layout
        let dynamicCSS = "";

        // Font Family (Entire System)
        if (doc.font_family && fontMap[doc.font_family]) {
            dynamicCSS += `*:not(.icon, .fa, .fab, .fas, .far, .octicon, .material-symbols-rounded, .material-icons, .m3-processed) { font-family: ${fontMap[doc.font_family]} !important; }\n`;
        }

        // Font Size Proportional Overrides
        if (doc.base_font_size) {
            root.style.setProperty("--base-font-size", doc.base_font_size + "px");
            // Automatically derive responsive frappe tailwind scales based on user's new base sizes
            root.style.setProperty("--text-xs", "calc(var(--base-font-size) * 0.82)");
            root.style.setProperty("--text-sm", "calc(var(--base-font-size) * 0.92)");
            root.style.setProperty("--text-md", "calc(var(--base-font-size) * 1)");
            root.style.setProperty("--text-lg", "calc(var(--base-font-size) * 1.15)");
            root.style.setProperty("--text-xl", "calc(var(--base-font-size) * 1.5)");

            dynamicCSS += `
                html, body, p, span, div:not([class*="h1"]):not([class*="h2"]):not([class*="h3"]):not([class*="h4"]):not([class*="h5"]):not([class*="h6"]), a, li, td, th, label, input:not([type="checkbox"]):not([type="radio"]), button, textarea, select, .form-control, .btn, .nav-link, .dropdown-item {
                    font-size: var(--base-font-size);
                }
                .text-muted { font-size: var(--text-sm) !important; }
                h1, .h1 { font-size: 2.25rem !important; }
                h2, .h2 { font-size: 1.875rem !important; }
                h3, .h3 { font-size: 1.5rem !important; }
                h4, .h4 { font-size: 1.25rem !important; }
                h5, .h5 { font-size: 1.125rem !important; }
                h6, .h6 { font-size: 1rem !important; }
            `;
        }

        // Toggles - Navbar (using CSS Selectors to avoid language mismatches)
        if (doc.navbar_type === 'Custom Navbar' && doc.custom_navbar_data) {
            try {
                var navData = JSON.parse(doc.custom_navbar_data);
                navData.forEach(function (row) {
                    if (row.hidden) {
                        if (row.element === 'search bar') {
                            dynamicCSS += `.navbar .search-bar, .navbar-form.search-bar { display: none !important; }\n`;
                        } else if (row.element === 'notifications') {
                            dynamicCSS += `.navbar .notification-list, .navbar .dropdown-message, .notifications-icon, [data-route="notifications"] { display: none !important; }\n`;
                        } else if (row.element === 'help') {
                            dynamicCSS += `.navbar .dropdown-help { display: none !important; }\n`;
                        } else if (row.element === 'breadcrumbs') {
                            dynamicCSS += `.navbar-breadcrumbs, .navbar .app-switcher-menu, #navbar-breadcrumbs, .breadcrumb-container, .page-breadcrumbs { display: none !important; }\n`;
                        } else if (row.element === 'language switcher') {
                            dynamicCSS += `.m3-lang-switcher, .dropdown-language { display: none !important; }\n`;
                        } else if (row.element === 'external link') {
                            dynamicCSS += `.m3-external-link { display: none !important; }\n`;
                        }
                    }
                });
            } catch (e) { }
        }

        // Toggles - Profile Menu (using exact href and onclick instead of translations)
        if (doc.profile_menu_type === 'Custom Profile Menu' && doc.custom_profile_data) {
            try {
                var profData = JSON.parse(doc.custom_profile_data);
                profData.forEach(function (row) {
                    if (row.hidden) {
                        if (row.element === 'My Profile') {
                            dynamicCSS += `.dropdown-navbar-user a[href="/app/user-profile"], .dropdown-navbar-user a[href="/app/user"] { display: none !important; }\n`;
                        } else if (row.element === 'Session Defaults') {
                            dynamicCSS += `.dropdown-navbar-user button[onclick*="session_default"] { display: none !important; }\n`;
                        } else if (row.element === 'View Website') {
                            dynamicCSS += `.dropdown-navbar-user button[onclick*="view_website"], .dropdown-navbar-user a[href="/"] { display: none !important; }\n`;
                        } else if (row.element === 'Apps') {
                            dynamicCSS += `.dropdown-navbar-user a[href="/app"] { display: none !important; }\n`;
                        } else if (row.element === 'Toggle Full Width') {
                            dynamicCSS += `.dropdown-navbar-user button[onclick*="toggle_full_width"] { display: none !important; }\n`;
                        }
                    }
                });
            } catch (e) { }
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
                dynamicCSS += `body:has(#page-login) { background: url('${doc.login_background_image}') no-repeat center center fixed !important; background-size: cover !important; }\n`;
                // Automatically make the title white text with text-shadow when a background image is present to contrast
                dynamicCSS += `.page-card-head h1, .page-card-head h4, .page-card-head p { color: #ffffff !important; text-shadow: 0 4px 18px rgba(0,0,0,0.8) !important; }\n`;
            }
            if (doc.login_overlay_opacity) {
                // z-index: 1 pushes it right behind the wrapper (z-index: 10)
                dynamicCSS += `body:has(#page-login)::after { content: ""; position: fixed; inset: 0; background: rgba(0,0,0,${doc.login_overlay_opacity}); z-index: 1; pointer-events: none; }\n`;
                dynamicCSS += `.for-login { position: relative; z-index: 10; box-shadow: none !important; background: transparent !important; }\n`;
            }
            if (doc.login_logo) {
                dynamicCSS += `body:has(#page-login) .page-card-head .app-logo { content: url('${doc.login_logo}') !important; width: auto !important; height: auto !important; max-height: 100px !important; margin: 0 auto; display: inline-block !important; }\n`;
            } else if (doc.custom_logo) {
                dynamicCSS += `body:has(#page-login) .page-card-head .app-logo { display: inline-block !important; }\n`;
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
                    if (parent && !document.querySelector('.m3-login-footer')) {
                        parent.insertAdjacentHTML('beforeend', `<div class="m3-login-footer mt-4 text-center text-muted" style="font-size: 13px;">${doc.login_footer_text}</div>`);
                    }
                }

                // Inject M3 Icons into the login inputs if they don't exist yet
                var emailInput = document.getElementById('login_email');
                if (emailInput && !emailInput.parentElement.querySelector('.m3-login-icon')) {
                    emailInput.insertAdjacentHTML('beforebegin', '<span class="material-symbols-rounded m3-login-icon">mail</span>');
                }

                var pwInput = document.getElementById('login_password');
                if (pwInput && !pwInput.parentElement.querySelector('.m3-login-icon')) {
                    pwInput.insertAdjacentHTML('beforebegin', '<span class="material-symbols-rounded m3-login-icon">lock</span>');
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
                injectCustomNavbarAndProfile();
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
            injectCustomNavbarAndProfile();
        }, 400);
    });
})();
