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
    },

    after_save(frm) {
        frappe.ui.toolbar.clear_cache();
        frappe.show_alert({ message: "Settings saved successfully! Reloading page...", indicator: "green" });
        setTimeout(() => window.location.reload(), 1500);
    },

    font_family: (frm) => renderFontPreview(frm),
    navbar_type: (frm) => renderCustomTables(frm),
    profile_menu_type: (frm) => renderCustomTables(frm),
    color_scheme: (frm) => applyThemeSettings(frm.doc),
});

function renderCustomTables(frm) {
    if (frm.doc.navbar_type === 'Custom Navbar') {
        const default_nav_elements = ["breadcrumbs", "search bar", "notifications", "help"];
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
