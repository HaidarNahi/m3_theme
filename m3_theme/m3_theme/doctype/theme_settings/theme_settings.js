// Copyright (c) 2026, Haidar Nahi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Theme Settings", {
    refresh(frm) {
        frm.add_custom_button(__("⚡ Preview Changes"), function () {
            applyThemeSettings(frm.doc);
            frappe.show_alert({ message: "Theme preview applied to this session", indicator: "green" });
        }, __("Theme"));

        frm.add_custom_button(__("↺ Reset to Defaults"), function () {
            frappe.confirm(
                "This will reset all theme settings to their defaults. Are you sure?",
                function () {
                    frappe.call({
                        method: "frappe.client.set_value",
                        args: {
                            doctype: "Theme Settings",
                            name: "Theme Settings",
                            fieldname: {
                                color_scheme: "System (Auto)",
                                color_palette: "Default",
                                font_family: "Readex Pro",
                                base_font_size: 14,
                                sidebar_type: "Default Sidebar",
                                navbar_type: "Default Navbar",
                                profile_menu_type: "Default Profile Menu",
                                show_social_login: 1,
                                show_email_password_login: 1,
                                login_overlay_opacity: 0.5,
                                inject_custom_css: 0,
                                inject_custom_js: 0,
                                custom_navbar_data: "",
                                custom_profile_data: ""
                            }
                        },
                        callback: function () {
                            frm.reload_doc();
                            frappe.show_alert({ message: "Settings reset to defaults", indicator: "blue" });
                        }
                    });
                }
            );
        }, __("Theme"));

        renderCustomTables(frm);
        renderCustomSidebarBuilder(frm);
    },

    after_save(frm) {
        frappe.ui.toolbar.clear_cache();
        frappe.show_alert({ message: "Settings saved successfully! Reloading page...", indicator: "green" });
        setTimeout(() => window.location.reload(), 1500);
    },

    font_family: (frm) => renderFontPreview(frm),
    sidebar_type: (frm) => renderCustomSidebarBuilder(frm),
    navbar_type: (frm) => renderCustomTables(frm),
    profile_menu_type: (frm) => renderCustomTables(frm),
    color_scheme: (frm) => applyThemeSettings(frm.doc),
});

function renderCustomSidebarBuilder(frm) {
    if (frm.doc.sidebar_type === 'Custom Sidebar') {
        let sidebar_data = frm.doc.custom_sidebar_data ? JSON.parse(frm.doc.custom_sidebar_data) : [];

        const renderTable = () => {
            let tbody_html = sidebar_data.map((row, idx) => `
                <tr data-idx="${idx}" class="sidebar-drag-row" style="background: transparent; border-bottom: 1px solid var(--border-color); cursor: grab; transition: background 0.2s;">
                    <td style="padding: 12px; width: 40px; text-align: center; vertical-align: middle; color: var(--text-muted);">
                        <span class="material-symbols-rounded" style="font-size: 18px; cursor: grab;">drag_indicator</span>
                    </td>
                    <td style="padding: 12px; vertical-align: middle; font-size:13px; font-weight:500;">
                        <div style="display:flex; align-items:center; gap: 8px;">
                            <span class="material-symbols-rounded" style="font-size:18px; color: var(--primary); font-variation-settings: 'FILL' ${row.icon_filled ? '1' : '0'};">${row.icon || 'circle'}</span>
                            ${row.title}
                        </div>
                    </td>
                    <td style="padding: 12px; vertical-align: middle; font-size:12px; color: var(--text-muted);">${row.link_type}</td>
                    <td style="padding: 12px; vertical-align: middle; font-size:12px;">${row.link_to || ''}</td>
                    <td style="padding: 12px; text-align: right; vertical-align: middle;">
                        <button class="btn btn-xs btn-default edit-sidebar-row" data-idx="${idx}" style="min-height: 28px !important; padding: 0 10px !important; border-radius: 100px !important; margin-right: 4px; box-shadow: none !important;">
                            <span class="material-symbols-rounded" style="font-size: 14px;">edit</span>
                        </button>
                        <button class="btn btn-xs btn-danger delete-sidebar-row" data-idx="${idx}" style="min-height: 28px !important; padding: 0 10px !important; border-radius: 100px !important; box-shadow: none !important;">
                            <span class="material-symbols-rounded" style="font-size: 14px;">delete</span>
                        </button>
                    </td>
                </tr>
            `).join('');

            let table_html = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; margin-top: 10px;">
                    <div style="font-size: 13px; color: var(--text-muted);">Drag rows to reorder them in the sidebar.</div>
                    <button class="btn btn-sm btn-primary" id="add-sidebar-item" style="border-radius: 100px !important;">
                        <span class="material-symbols-rounded" style="font-size: 16px;">add</span> Add Element
                    </button>
                </div>
                <div class="m3-custom-table-wrapper" style="background: var(--surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: none !important;">
                    <table class="table m3-custom-table" style="margin: 0; border: none; width: 100%;">
                        <thead style="background: var(--surface-container-low);">
                            <tr>
                                <th style="padding: 8px 12px; font-weight: 500; font-size:13px; border:none; width:40px;"></th>
                                <th style="padding: 8px 12px; font-weight: 500; font-size:13px; border:none;">Title</th>
                                <th style="padding: 8px 12px; font-weight: 500; font-size:13px; border:none;">Link Type</th>
                                <th style="padding: 8px 12px; font-weight: 500; font-size:13px; border:none;">Link To</th>
                                <th style="padding: 8px 12px; font-weight: 500; font-size:13px; border:none; text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="custom-sidebar-tbody">
                            ${sidebar_data.length ? tbody_html : `<tr><td colspan="5" style="padding: 40px; text-align: center; color: var(--text-muted); font-size: 13px;">No sidebar items configured. Click "Add Element" to start building.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;

            frm.get_field("custom_sidebar_html").$wrapper.html(table_html);

            // Init Sortable UI
            if (sidebar_data.length > 0 && typeof Sortable !== 'undefined') {
                new Sortable(frm.get_field("custom_sidebar_html").$wrapper.find('#custom-sidebar-tbody')[0], {
                    handle: '.sidebar-drag-row',
                    animation: 150,
                    onEnd: function (evt) {
                        const item = sidebar_data.splice(evt.oldIndex, 1)[0];
                        sidebar_data.splice(evt.newIndex, 0, item);
                        frm.set_value("custom_sidebar_data", JSON.stringify(sidebar_data));
                        renderTable(); // re-render to fix inner data consistency
                    }
                });
            }

            // Hover rows
            frm.get_field("custom_sidebar_html").$wrapper.find('.sidebar-drag-row').hover(function () {
                $(this).css('background', 'var(--surface-container-lowest)');
            }, function () {
                $(this).css('background', 'transparent');
            });

            // Action Buttons
            frm.get_field("custom_sidebar_html").$wrapper.find('#add-sidebar-item').on('click', () => openSidebarItemDialog(frm, null, null, sidebar_data, renderTable));

            frm.get_field("custom_sidebar_html").$wrapper.find('.edit-sidebar-row').on('click', function () {
                let idx = $(this).data('idx');
                openSidebarItemDialog(frm, sidebar_data[idx], idx, sidebar_data, renderTable);
            });

            frm.get_field("custom_sidebar_html").$wrapper.find('.delete-sidebar-row').on('click', function () {
                let idx = $(this).data('idx');
                frappe.confirm('Are you sure you want to delete this element?', () => {
                    sidebar_data.splice(idx, 1);
                    frm.set_value("custom_sidebar_data", JSON.stringify(sidebar_data));
                    renderTable();
                });
            });
        };

        renderTable();

        if (!frm.doc.custom_sidebar_data) {
            frm.set_value("custom_sidebar_data", JSON.stringify(sidebar_data));
        }
    } else {
        frm.get_field("custom_sidebar_html").$wrapper.empty();
    }
}

function openSidebarItemDialog(frm, data, idx, sidebar_data, renderCallback) {
    var is_new = idx === null;

    var d = new frappe.ui.Dialog({
        title: is_new ? 'Add Sidebar Element' : 'Edit Sidebar Element',
        fields: [
            { label: 'Title', fieldname: 'title', fieldtype: 'Data', reqd: 1, default: data ? data.title : '' },
            { fieldtype: 'Section Break' },
            { label: 'Icon Code', fieldname: 'icon', fieldtype: 'Data', reqd: 1, default: data ? data.icon : 'dashboard', description: 'Click Browse below to pick from common ERP Material icons' },
            { label: 'Filled Icon', fieldname: 'icon_filled', fieldtype: 'Check', default: data ? data.icon_filled : 0 },
            { fieldtype: 'Button', label: 'Browse Icons', fieldname: 'browse_icons' },
            { fieldtype: 'Section Break' },
            { label: 'Link Type', fieldname: 'link_type', fieldtype: 'Select', options: 'DocType\nPage\nWorkspace\nReport\nDashboard', reqd: 1, default: data ? data.link_type : 'DocType' },
            { label: 'Link To', fieldname: 'link_to', fieldtype: 'Dynamic Link', options: 'link_type', reqd: 1, default: data ? data.link_to : '' },
        ],
        primary_action_label: is_new ? 'Add Element' : 'Save Changes',
        primary_action(values) {
            if (is_new) {
                sidebar_data.push(values);
            } else {
                sidebar_data[idx] = values;
            }
            frm.set_value("custom_sidebar_data", JSON.stringify(sidebar_data));
            renderCallback();
            d.hide();
        }
    });

    d.fields_dict.browse_icons.$input.removeClass('btn-default').addClass('btn-secondary form-control').css({ 'width': '100%' });
    d.fields_dict.browse_icons.$wrapper.on('click', () => openIconPicker(d));

    d.show();
}

function openIconPicker(parent_dialog) {
    const common_icons = [
        "home", "dashboard", "person", "group", "group_work", "settings", "shopping_cart", "inventory_2", "bar_chart",
        "pie_chart", "trending_up", "account_balance", "account_balance_wallet", "receipt_long", "payments",
        "store", "local_shipping", "engineering", "build", "assignment", "event", "task", "mail", "chat",
        "notifications", "folder", "description", "article", "print", "search", "filter_list", "list",
        "grid_view", "table_chart", "calendar_month", "public", "security", "warning", "error", "done",
        "close", "apps", "widgets", "category", "layers", "palette", "brush", "cloud", "api", "code", "terminal",
        "database", "memory", "speed", "bug_report", "verified", "attach_money", "credit_card", "point_of_sale",
        "shopping_bag", "storefront", "support_agent", "medical_services", "factory", "precision_manufacturing",
        "agriculture", "science", "biotech", "architecture", "handshake", "gavel", "balance", "school"
    ];

    var iconD = new frappe.ui.Dialog({
        title: 'Select Material 3 Icon',
        fields: [
            { fieldname: 'search', fieldtype: 'Data', label: 'Search Icons', placeholder: 'e.g. settings' },
            { fieldtype: 'HTML', fieldname: 'icon_grid' }
        ],
        primary_action_label: 'Close',
        primary_action() { iconD.hide(); }
    });

    const renderIcons = (query = '') => {
        let filtered = common_icons.filter(i => i.includes(query.toLowerCase()));
        let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); gap: 8px; max-height: 400px; overflow-y: auto; padding: 4px; margin-top: 10px;">`;
        filtered.forEach(icon => {
            html += `
                <div class="m3-icon-cell" data-icon="${icon}" style="display: flex; flex-direction: column; align-items: center; padding: 12px 4px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s;">
                    <span class="material-symbols-rounded" style="font-size: 28px; color: var(--text-color); margin-bottom: 8px;">${icon}</span>
                    <span style="font-size: 10px; color: var(--text-muted); text-align: center; word-break: break-all; width: 100%;">${icon}</span>
                </div>
            `;
        });
        html += `</div>`;
        iconD.fields_dict.icon_grid.$wrapper.html(html);

        iconD.fields_dict.icon_grid.$wrapper.find('.m3-icon-cell').hover(function () {
            $(this).css({ 'background': 'var(--surface-container-high)', 'border-color': 'var(--primary)' });
        }, function () {
            $(this).css({ 'background': 'transparent', 'border-color': 'var(--border-color)' });
        });

        iconD.fields_dict.icon_grid.$wrapper.find('.m3-icon-cell').on('click', function () {
            parent_dialog.set_value('icon', $(this).data('icon'));
            iconD.hide();
        });
    };

    renderIcons();
    iconD.fields_dict.search.$input.on('input', function () { renderIcons($(this).val()); });
    setTimeout(() => iconD.fields_dict.search.$input.focus(), 300);
    iconD.show();
}

function renderCustomTables(frm) {
    if (frm.doc.navbar_type === 'Custom Navbar') {
        const default_nav_elements = ["breadcrumbs", "search bar", "notifications", "help", "language switcher", "external link"];
        let nav_data = frm.doc.custom_navbar_data ? JSON.parse(frm.doc.custom_navbar_data) : default_nav_elements.map(e => ({ element: e, hidden: 0 }));

        default_nav_elements.forEach(e => {
            if (!nav_data.find(d => d.element === e)) nav_data.push({ element: e, hidden: 0 });
        });
        // cleanup obsolete
        nav_data = nav_data.filter(d => default_nav_elements.includes(d.element));

        let nav_html = `
            <table class="table table-bordered m3-custom-table" style="background: var(--surface); border-radius: 8px; overflow: hidden; margin-top: 10px;">
                <thead style="background: var(--surface-container-high);">
                    <tr><th style="padding: 12px; font-weight: 500; font-size:13px;">Element</th><th style="padding: 12px; font-weight: 500; font-size:13px; width: 100px; text-align: center;">Hidden</th></tr>
                </thead>
                <tbody>
                    ${nav_data.map((row, idx) => `
                        <tr>
                            <td style="padding: 12px; vertical-align: middle; font-size:13px; font-family:var(--font-family);">${row.element}</td>
                            <td style="padding: 12px; text-align: center; vertical-align: middle;">
                                <input type="checkbox" data-idx="${idx}" class="nav-hidden-chk" ${row.hidden ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary);">
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        <div class="text-muted" style="font-size: 11px; margin-top: 4px;">Check the box to natively hide the element from the top navbar.</div>
    `;

        frm.get_field("custom_navbar_html").$wrapper.html(nav_html);

        frm.get_field("custom_navbar_html").$wrapper.find('.nav-hidden-chk').on('change', function () {
            let idx = $(this).data('idx');
            nav_data[idx].hidden = this.checked ? 1 : 0;
            frm.set_value("custom_navbar_data", JSON.stringify(nav_data));
        });

        if (!frm.doc.custom_navbar_data) {
            frm.set_value("custom_navbar_data", JSON.stringify(nav_data));
        }
    } else {
        frm.get_field("custom_navbar_html").$wrapper.empty();
    }

    if (frm.doc.profile_menu_type === 'Custom Profile Menu') {
        const default_prof_elements = ["My Profile", "Session Defaults", "View Website", "Apps", "Toggle Full Width"];
        let prof_data = frm.doc.custom_profile_data ? JSON.parse(frm.doc.custom_profile_data) : default_prof_elements.map(e => ({ element: e, hidden: 0 }));

        default_prof_elements.forEach(e => {
            if (!prof_data.find(d => d.element === e)) prof_data.push({ element: e, hidden: 0 });
        });
        // cleanup obsolete
        prof_data = prof_data.filter(d => default_prof_elements.includes(d.element));

        let prof_html = `
        <table class="table table-bordered m3-custom-table" style="background: var(--surface); border-radius: 8px; overflow: hidden; margin-top: 10px;">
                <thead style="background: var(--surface-container-high);">
                    <tr><th style="padding: 12px; font-weight: 500; font-size:13px;">Dropdown Item</th><th style="padding: 12px; font-weight: 500; font-size:13px; width: 100px; text-align: center;">Hidden</th></tr>
                </thead>
                <tbody>
                    ${prof_data.map((row, idx) => `
                        <tr>
                            <td style="padding: 12px; vertical-align: middle; font-size:13px; font-family:var(--font-family);">${row.element}</td>
                            <td style="padding: 12px; text-align: center; vertical-align: middle;">
                                <input type="checkbox" data-idx="${idx}" class="prof-hidden-chk" ${row.hidden ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--primary);">
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        <div class="text-muted" style="font-size: 11px; margin-top: 4px;">Check the box to natively hide the element from your profile menu.</div>
    `;

        frm.get_field("custom_profile_html").$wrapper.html(prof_html);

        frm.get_field("custom_profile_html").$wrapper.find('.prof-hidden-chk').on('change', function () {
            let idx = $(this).data('idx');
            prof_data[idx].hidden = this.checked ? 1 : 0;
            frm.set_value("custom_profile_data", JSON.stringify(prof_data));
        });

        if (!frm.doc.custom_profile_data) {
            frm.set_value("custom_profile_data", JSON.stringify(prof_data));
        }
    } else {
        frm.get_field("custom_profile_html").$wrapper.empty();
    }
}

function renderFontPreview(frm) {
    const font = frm.doc.font_family;
    if (!font || font === "System Default") return;

    const previewHtml = `
        <div style="margin-top:8px;padding:10px 14px;background:#f8f8f8;border-radius:8px;font-family:'${font}',sans-serif">
			<span style="font-size:16px;font-weight:600">The quick brown fox jumps over the lazy dog</span><br>
			<span style="font-size:13px;color:#666">0123456789 — آهلاً وسهلاً — ERPNext Theme</span>
		</div>`;

    frm.get_field("font_family").$wrapper.find(".font-preview").remove();
    frm.get_field("font_family").$wrapper.append(`<div class="font-preview">${previewHtml}</div>`);
}

function applyThemeSettings(doc) {
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
}
