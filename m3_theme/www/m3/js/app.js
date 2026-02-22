/**
 * app.js — Main Application Logic
 * SPA routing, data table, form validation,
 * snackbar queue, side sheet, customizer panel.
 *
 * Uses inline <template> tags (id="tpl-home" etc.) so the prototype works
 * when opened directly as a local file (file:// protocol, no fetch/CORS needed).
 */
(function () {
    'use strict';

    // =====================================================================
    // ROUTER — Hash-based SPA using inline <template> tags
    // =====================================================================

    // Map page IDs to their <template id="tpl-X"> counterparts in index.html
    const PAGE_TEMPLATES = {
        home: 'tpl-home',
        list: 'tpl-list',
        form: 'tpl-form',
        dashboard: 'tpl-dashboard',
    };

    // Map nav item data-page values → page IDs
    const NAV_PAGE_MAP = {
        home: 'home',
        accounting: 'dashboard',
        procurement: 'list',
        sales: 'list',
        crm: 'list',
        stock: 'list',
        manufacturing: 'list',
        projects: 'list',
        assets: 'list',
        pos: 'list',
        hr: 'list',
        quality: 'list',
        support: 'list',
        reports: 'dashboard',
        settings: 'home',
    };

    let currentPage = null;

    async function navigateTo(pageId) {
        const tplId = PAGE_TEMPLATES[pageId] || PAGE_TEMPLATES['home'];
        const tpl = document.getElementById(tplId);
        const contentArea = document.getElementById('main-content');
        if (!contentArea) return;

        // Animate old content out
        contentArea.classList.add('page-leave');
        await new Promise(r => setTimeout(r, 120));
        contentArea.classList.remove('page-leave');

        if (tpl) {
            contentArea.innerHTML = tpl.innerHTML;
        } else {
            contentArea.innerHTML = `<div class="page-content"><p style="color:var(--md-sys-color-error)">Page not found: ${pageId}</p></div>`;
        }

        // Animate new content in
        contentArea.classList.add('page-enter');
        contentArea.addEventListener('animationend', () => contentArea.classList.remove('page-enter'), { once: true });

        currentPage = pageId;

        // Re-init page-specific features
        initDataTable();
        initForms();
        initCharts();
        initFormFieldFloating();
        applyCardStagger();
        M3Ripple.init();
    }

    function handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const pageId = NAV_PAGE_MAP[hash] || hash;
        const resolvedId = PAGES[pageId] ? pageId : 'home';
        navigateTo(resolvedId);
        M3Nav.setActiveNavItem(hash);
    }

    // =====================================================================
    // DATA TABLE — sort, select, filter
    // =====================================================================
    function initDataTable() {
        const table = document.querySelector('.data-table');
        if (!table) return;

        // Sorting
        table.querySelectorAll('th[data-col]').forEach(th => {
            th.addEventListener('click', () => {
                const asc = th.classList.contains('sorted-asc');
                table.querySelectorAll('th').forEach(t => {
                    t.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
                    const icon = t.querySelector('.sort-icon');
                    if (icon) icon.textContent = 'unfold_more';
                });
                th.classList.add('sorted', asc ? 'sorted-desc' : 'sorted-asc');
                const icon = th.querySelector('.sort-icon');
                if (icon) icon.textContent = asc ? 'arrow_upward' : 'arrow_downward';
            });
        });

        // Row selection
        const selectAll = table.querySelector('.select-all-cb');
        const tbody = table.querySelector('tbody');
        if (!selectAll || !tbody) return;

        selectAll.addEventListener('change', () => {
            tbody.querySelectorAll('.m3-checkbox').forEach(cb => {
                cb.checked = selectAll.checked;
                cb.closest('tr').classList.toggle('selected', selectAll.checked);
            });
            updateBulkBar();
        });

        tbody.querySelectorAll('.m3-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                cb.closest('tr').classList.toggle('selected', cb.checked);
                updateBulkBar();
                const allCbs = tbody.querySelectorAll('.m3-checkbox');
                const checkedCbs = tbody.querySelectorAll('.m3-checkbox:checked');
                if (selectAll) {
                    selectAll.checked = allCbs.length === checkedCbs.length;
                    selectAll.indeterminate = checkedCbs.length > 0 && checkedCbs.length < allCbs.length;
                }
            });
        });

        // Row click (not on checkbox)
        tbody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.classList.contains('m3-checkbox') || e.target.tagName === 'INPUT') return;
                window.location.hash = 'form';
            });
        });
    }

    function updateBulkBar() {
        const bar = document.querySelector('.bulk-action-bar');
        const count = document.querySelectorAll('tbody .m3-checkbox:checked').length;
        if (!bar) return;
        bar.classList.toggle('visible', count > 0);
        const countEl = bar.querySelector('.bulk-count');
        if (countEl) countEl.textContent = `${count} selected`;
    }

    // =====================================================================
    // FORM — floating labels, validation
    // =====================================================================
    function initFormFieldFloating() {
        document.querySelectorAll('.form-field').forEach(field => {
            const input = field.querySelector('input, select, textarea');
            if (!input) return;

            const update = () => {
                field.classList.toggle('has-value', !!(input.value || input.placeholder));
            };

            input.addEventListener('input', update);
            input.addEventListener('change', update);
            input.addEventListener('blur', () => {
                if (input.required && !input.value) {
                    field.classList.add('error');
                    let helper = field.querySelector('.form-helper');
                    if (!helper) {
                        helper = document.createElement('div');
                        helper.className = 'form-helper error-text';
                        field.appendChild(helper);
                    }
                    helper.textContent = 'This field is required';
                } else {
                    field.classList.remove('error');
                }
            });

            update();
        });
    }

    function initForms() {
        initFormFieldFloating();

        // form-section collapse
        document.querySelectorAll('.form-section-header').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const body = hdr.nextElementSibling;
                const icon = hdr.querySelector('.collapse-icon');
                const isOpen = body.style.display !== 'none';
                body.style.display = isOpen ? 'none' : '';
                if (icon) icon.textContent = isOpen ? 'expand_more' : 'expand_less';
            });
        });

        // Save / Submit buttons
        document.querySelectorAll('[data-action="save"]').forEach(btn => {
            btn.addEventListener('click', () => M3Snackbar.show('Document saved successfully', { action: 'Undo' }));
        });
        document.querySelectorAll('[data-action="submit"]').forEach(btn => {
            btn.addEventListener('click', () => {
                showDialog({
                    icon: 'warning',
                    title: 'Submit Invoice?',
                    body: 'Once submitted, this document cannot be edited. Add an amendment to make changes.',
                    primaryLabel: 'Submit',
                    onPrimary: () => M3Snackbar.show('Invoice submitted', { type: 'success' }),
                });
            });
        });
    }

    // =====================================================================
    // CHARTS — inline SVG bar/line/donut
    // =====================================================================
    function initCharts() {
        renderBarChart();
        renderLineChart();
        renderDonutChart();
        renderAreaChart();
    }

    function renderBarChart() {
        const el = document.getElementById('bar-chart');
        if (!el) return;
        const data = [42, 68, 55, 81, 60, 74, 90, 65, 72, 88, 95, 78];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const max = Math.max(...data);
        const w = 480, h = 160, pad = 20;
        const barW = (w - pad * 2) / data.length - 4;

        let bars = data.map((v, i) => {
            const x = pad + i * ((w - pad * 2) / data.length) + 2;
            const barH = (v / max) * (h - 30);
            const y = h - barH - 20;
            return `
        <rect x="${x}" y="${y}" width="${barW}" height="${barH}"
          rx="4" fill="var(--md-sys-color-primary)" opacity="${0.5 + 0.5 * (v / max)}"
          class="m3-interactive">
          <title>${months[i]}: $${(v * 12000).toLocaleString()}</title>
        </rect>
        <text x="${x + barW / 2}" y="${h - 4}" text-anchor="middle"
          font-size="9" fill="var(--md-sys-color-on-surface-variant)">${months[i]}</text>
      `;
        }).join('');

        el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">${bars}</svg>`;
    }

    function renderLineChart() {
        const el = document.getElementById('line-chart');
        if (!el) return;
        const data = [30, 45, 28, 60, 52, 68, 75, 48, 80, 72, 90, 85];
        const max = Math.max(...data);
        const w = 480, h = 140;
        const xs = data.map((_, i) => 20 + i * (w - 40) / (data.length - 1));
        const ys = data.map(v => h - 20 - (v / max) * (h - 40));

        const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
        const areaD = `${pathD} L ${xs[xs.length - 1]} ${h - 20} L ${xs[0]} ${h - 20} Z`;

        const dots = xs.map((x, i) =>
            `<circle cx="${x}" cy="${ys[i]}" r="4" fill="var(--md-sys-color-secondary)" stroke="var(--md-sys-color-surface)" stroke-width="2"/>`
        ).join('');

        el.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" class="chart-svg">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--md-sys-color-secondary)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--md-sys-color-secondary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${areaD}" fill="url(#lineGrad)"/>
        <path d="${pathD}" fill="none" stroke="var(--md-sys-color-secondary)" stroke-width="2.5" stroke-linejoin="round"/>
        ${dots}
      </svg>`;
    }

    function renderDonutChart() {
        const el = document.getElementById('donut-chart');
        if (!el) return;
        const segments = [
            { label: 'Salaries', value: 42, color: 'var(--md-sys-color-primary)' },
            { label: 'Rent', value: 18, color: 'var(--md-sys-color-secondary)' },
            { label: 'Marketing', value: 22, color: 'var(--md-sys-color-tertiary)' },
            { label: 'Other', value: 18, color: 'var(--md-sys-color-outline)' },
        ];
        const total = segments.reduce((s, seg) => s + seg.value, 0);
        const cx = 80, cy = 80, r = 64, inner = 44;
        let startAngle = -90;

        const paths = segments.map(seg => {
            const angle = (seg.value / total) * 360;
            const endAngle = startAngle + angle;
            const x1 = cx + r * Math.cos(startAngle * Math.PI / 180);
            const y1 = cy + r * Math.sin(startAngle * Math.PI / 180);
            const x2 = cx + r * Math.cos(endAngle * Math.PI / 180);
            const y2 = cy + r * Math.sin(endAngle * Math.PI / 180);
            const xi1 = cx + inner * Math.cos(endAngle * Math.PI / 180);
            const yi1 = cy + inner * Math.sin(endAngle * Math.PI / 180);
            const xi2 = cx + inner * Math.cos(startAngle * Math.PI / 180);
            const yi2 = cy + inner * Math.sin(startAngle * Math.PI / 180);
            const large = angle > 180 ? 1 : 0;
            const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi2} ${yi2} Z`;
            startAngle = endAngle;
            return `<path d="${path}" fill="${seg.color}" opacity="0.9"><title>${seg.label}: ${seg.value}%</title></path>`;
        });

        const legend = segments.map(s =>
            `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
        <div style="width:10px;height:10px;border-radius:2px;background:${s.color};flex-shrink:0"></div>
        <span style="font-size:12px;color:var(--md-sys-color-on-surface-variant)">${s.label}</span>
        <span style="font-size:12px;font-weight:500;color:var(--md-sys-color-on-surface);margin-left:auto">${s.value}%</span>
      </div>`
        ).join('');

        el.innerHTML = `
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
        <svg viewBox="0 0 160 160" width="160" height="160">
          ${paths.join('')}
          <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="20" font-family="Google Sans" fill="var(--md-sys-color-on-surface)">42%</text>
          <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="var(--md-sys-color-on-surface-variant)">Salaries</text>
        </svg>
        <div style="flex:1">${legend}</div>
      </div>`;
    }

    function renderAreaChart() {
        const el = document.getElementById('area-chart');
        if (!el) return;
        const profit = [15, 22, 18, 35, 28, 42, 38, 45, 52, 48, 62, 58];
        const revenue = [80, 95, 82, 110, 98, 125, 118, 130, 145, 138, 160, 152];
        const max = Math.max(...revenue);
        const w = 480, h = 140;
        const xs = profit.map((_, i) => 20 + i * (w - 40) / (profit.length - 1));

        const makePath = (data, closed) => {
            const ys = data.map(v => h - 20 - (v / max) * (h - 40));
            const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
            if (closed) return `${d} L ${xs[xs.length - 1]} ${h - 20} L ${xs[0]} ${h - 20} Z`;
            return d;
        };

        el.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" class="chart-svg">
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--md-sys-color-primary)" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="var(--md-sys-color-primary)" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--md-sys-color-secondary)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--md-sys-color-secondary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${makePath(revenue, true)}" fill="url(#revGrad)"/>
        <path d="${makePath(profit, true)}" fill="url(#profGrad)"/>
        <path d="${makePath(revenue, false)}" fill="none" stroke="var(--md-sys-color-primary)" stroke-width="2"/>
        <path d="${makePath(profit, false)}" fill="none" stroke="var(--md-sys-color-secondary)" stroke-width="2" stroke-dasharray="4 2"/>
      </svg>`;
    }

    // =====================================================================
    // SNACKBAR SYSTEM
    // =====================================================================
    const SNACKBAR_TYPES = {
        info: { icon: 'info' },
        success: { icon: 'check_circle' },
        error: { icon: 'error' },
        warning: { icon: 'warning' },
    };

    window.M3Snackbar = {
        container: null,
        queue: [],

        init() {
            this.container = document.querySelector('.snackbar-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'snackbar-container';
                document.body.appendChild(this.container);
            }
        },

        show(message, opts = {}) {
            const { action, type = 'info', duration = 4000 } = opts;
            const meta = SNACKBAR_TYPES[type] || SNACKBAR_TYPES.info;

            const snack = document.createElement('div');
            snack.className = 'snackbar m3-ripple';
            snack.innerHTML = `
        <span class="material-symbols-outlined icon-sm" style="flex-shrink:0">${meta.icon}</span>
        <span style="flex:1">${message}</span>
        ${action ? `<button class="snackbar-action m3-ripple">${action}</button>` : ''}
      `;

            this.container.appendChild(snack);

            const dismiss = () => {
                snack.classList.add('leaving');
                snack.addEventListener('animationend', () => snack.remove(), { once: true });
            };

            if (action) {
                snack.querySelector('.snackbar-action').addEventListener('click', dismiss);
            }

            setTimeout(dismiss, duration);
        },
    };

    // =====================================================================
    // DIALOG
    // =====================================================================
    function showDialog({ icon, title, body, primaryLabel = 'Confirm', secondaryLabel = 'Cancel', onPrimary, onSecondary } = {}) {
        const scrim = document.createElement('div');
        scrim.className = 'dialog-scrim';
        scrim.innerHTML = `
      <div class="m3-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        ${icon ? `<div class="dialog-icon"><span class="material-symbols-outlined icon-lg filled">${icon}</span></div>` : ''}
        <div class="dialog-title" id="dialog-title">${title || ''}</div>
        ${body ? `<div class="dialog-body">${body}</div>` : ''}
        <div class="dialog-actions">
          <button class="btn btn-text m3-ripple" id="dialog-secondary">${secondaryLabel}</button>
          <button class="btn btn-filled m3-ripple" id="dialog-primary">${primaryLabel}</button>
        </div>
      </div>
    `;

        document.body.appendChild(scrim);
        requestAnimationFrame(() => scrim.classList.add('open'));

        const close = () => {
            scrim.classList.remove('open');
            setTimeout(() => scrim.remove(), 300);
        };

        scrim.querySelector('#dialog-primary').addEventListener('click', () => {
            if (onPrimary) onPrimary();
            close();
        });
        scrim.querySelector('#dialog-secondary').addEventListener('click', () => {
            if (onSecondary) onSecondary();
            close();
        });

        scrim.addEventListener('click', (e) => {
            if (e.target === scrim) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        }, { once: true });
    }

    window.M3Dialog = { show: showDialog };

    // =====================================================================
    // SIDE SHEET (Customizer)
    // =====================================================================
    function initCustomizerSheet() {
        const sheet = document.getElementById('customizer-sheet');
        const scrim = document.getElementById('customizer-scrim');
        const openBtn = document.getElementById('open-customizer');
        const closeBtn = document.getElementById('close-customizer');
        const contentEl = document.getElementById('customizer-content');

        if (!sheet) return;

        // Build content
        if (contentEl && contentEl.childElementCount === 0) {
            M3Theme.buildCustomizerContent(contentEl);
            M3Theme.wire();
            // Re-apply current state to new elements
            const s = M3Theme.getState();
            document.querySelectorAll('.color-swatch').forEach(el => el.classList.toggle('active', el.dataset.preset === s.colorPreset));
            document.querySelectorAll('[data-theme-option]').forEach(el => el.classList.toggle('active', el.dataset.themeOption === s.theme));
            document.querySelectorAll('.density-option').forEach(el => el.classList.toggle('active', el.dataset.density === s.density));
            document.querySelectorAll('[data-font-scale-option]').forEach(el => el.classList.toggle('active', el.dataset.fontScaleOption === s.fontScale));
        }

        const open = () => {
            sheet.classList.add('open');
            if (scrim) scrim.classList.add('visible');
        };
        const close = () => {
            sheet.classList.add('closing');
            sheet.classList.remove('open');
            setTimeout(() => sheet.classList.remove('closing'), 300);
            if (scrim) scrim.classList.remove('visible');
        };

        if (openBtn) openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (scrim) scrim.addEventListener('click', close);
    }

    // =====================================================================
    // FLOATING LABEL: update on page init
    // =====================================================================
    function applyCardStagger() {
        document.querySelectorAll('.module-card').forEach((card, i) => {
            card.style.setProperty('--card-index', i);
        });
        document.querySelectorAll('.kpi-card').forEach((card, i) => {
            const kpiVal = card.querySelector('.kpi-value');
            if (kpiVal) kpiVal.style.setProperty('--animation-delay', i * 100);
        });
    }

    // =====================================================================
    // SEARCH BAR — filter table rows
    // =====================================================================
    function initSearch() {
        const searchInput = document.getElementById('global-search');
        if (!searchInput) return;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            document.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = query === '' || row.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    // =====================================================================
    // FILTER CHIPS toggle
    // =====================================================================
    function initFilterChips() {
        document.querySelectorAll('.chip-filter').forEach(chip => {
            chip.addEventListener('click', () => chip.classList.toggle('selected'));
        });
    }

    // =====================================================================
    // INIT
    // =====================================================================
    document.addEventListener('DOMContentLoaded', () => {
        // Init subsystems
        M3Snackbar.init();
        M3Nav.init();
        M3Ripple.init();

        // Nav item click routing
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', () => {
                window.location.hash = item.dataset.page;
            });
        });

        // FAB / quick nav
        document.querySelectorAll('[data-navigate]').forEach(el => {
            el.addEventListener('click', () => {
                window.location.hash = el.dataset.navigate;
            });
        });

        // Customizer
        initCustomizerSheet();

        // Quick theme toggle (moon/sun icon in top bar)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.addEventListener('click', M3Theme.toggle.bind(M3Theme));

        // Route on hash change
        window.addEventListener('hashchange', handleRoute);

        // Initial route
        handleRoute();

        // Global search
        initSearch();

        // Filter chips
        initFilterChips();
    });

    window.M3App = {
        navigateTo,
        showDialog,
        initDataTable,
        initForms,
        initCharts,
    };
})();
