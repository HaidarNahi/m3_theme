// Copyright (c) 2026, Haidar Nahi and contributors
// For license information, please see license.txt

frappe.ui.form.on("Theme Settings", {
    refresh(frm) {
        // ── Preview button: apply settings to current session immediately ──
        frm.add_custom_button(__("⚡ Preview Changes"), function () {
            applyThemeSettings(frm.doc);
            frappe.show_alert({ message: "Theme preview applied to this session", indicator: "green" });
        }, __("Theme"));

        // ── Reset to defaults button ──
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
                                primary_color: "",
                                secondary_color: "",
                                surface_color: "",
                                background_color: "",
                                error_color: "",
                                on_primary_color: "",
                                font_family: "Readex Pro",
                                base_font_size: 14,
                                sidebar_type: "Default Sidebar",
                                navbar_type: "Default Navbar",
                                profile_menu_type: "Default Profile Menu",
                                show_social_login: 1,
                                show_email_password_login: 1,
                                login_overlay_opacity: 0.5,
                                workspace_bg_color: "",
                                inject_custom_css: 0,
                                inject_custom_js: 0,
                            },
                        },
                        callback: function () {
                            frm.reload_doc();
                            frappe.show_alert({ message: "Settings reset to defaults", indicator: "blue" });
                        },
                    });
                }
            );
        }, __("Theme"));

        // ── Color palette live preview swatches ──
        renderColorPreview(frm);
    },

    after_save(frm) {
        frappe.ui.toolbar.clear_cache();
        frappe.show_alert({ message: "Settings saved successfully! Reloading page...", indicator: "green" });
        setTimeout(() => window.location.reload(), 1500);
    },

    // Re-render preview on any color change
    primary_color: (frm) => renderColorPreview(frm),
    secondary_color: (frm) => renderColorPreview(frm),
    surface_color: (frm) => renderColorPreview(frm),
    background_color: (frm) => renderColorPreview(frm),
    error_color: (frm) => renderColorPreview(frm),
    on_primary_color: (frm) => renderColorPreview(frm),
    font_family: (frm) => renderFontPreview(frm),
});

// ─────────────────────────────────────────────
//  LIVE COLOR PREVIEW
// ─────────────────────────────────────────────
function renderColorPreview(frm) {
    const colors = [
        { label: "Primary", val: frm.doc.primary_color },
        { label: "Secondary", val: frm.doc.secondary_color },
        { label: "Surface", val: frm.doc.surface_color },
        { label: "Background", val: frm.doc.background_color },
        { label: "Error", val: frm.doc.error_color },
        { label: "On Primary", val: frm.doc.on_primary_color },
    ].filter((c) => c.val);

    if (!colors.length) return;

    const swatches = colors
        .map(
            (c) => `
		<div style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;margin-right:12px">
			<div style="width:40px;height:40px;border-radius:50%;background:${c.val};border:2px solid rgba(0,0,0,0.08);box-shadow:0 2px 4px rgba(0,0,0,0.12)"></div>
			<span style="font-size:10px;color:#666">${c.label}</span>
		</div>`
        )
        .join("");

    frm.get_field("color_scheme").$wrapper.find(".color-preview-strip").remove();
    frm.get_field("color_scheme").$wrapper.append(
        `<div class="color-preview-strip" style="margin-top:12px;padding:12px;background:#f8f8f8;border-radius:8px;display:flex;flex-wrap:wrap;align-items:center">${swatches}</div>`
    );
}

// ─────────────────────────────────────────────
//  FONT PREVIEW
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
//  APPLY SETTINGS TO CURRENT SESSION (preview)
// ─────────────────────────────────────────────
function applyThemeSettings(doc) {
    const root = document.documentElement;

    function hexToRgbStr(hex) {
        if (!hex || hex.length < 7) return null;
        var c = hex.substring(1).split('');
        if (c.length == 3) { c = [c[0], c[0], c[1], c[1], c[2], c[2]]; }
        c = '0x' + c.join('');
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(', ');
    }

    // Colors
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
    const fontMap = {
        "Readex Pro": "'Readex Pro', sans-serif",
        Inter: "'Inter', sans-serif",
        Roboto: "'Roboto', sans-serif",
        "Noto Sans": "'Noto Sans', sans-serif",
        Poppins: "'Poppins', sans-serif",
        Outfit: "'Outfit', sans-serif",
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

    let dynamicCSS = "";

    if (doc.workspace_bg_color) {
        dynamicCSS += `body.m3-desk, #page-desktop { background: ${doc.workspace_bg_color} !important; }\n`;
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
                display: inline-block !important;
            }
        `;
    }

    // Mount dynamic styles safely
    var dynStyle = document.getElementById('m3-theme-dynamic-css');
    if (!dynStyle) {
        dynStyle = document.createElement('style');
        dynStyle.id = 'm3-theme-dynamic-css';
        document.head.appendChild(dynStyle);
    }
    dynStyle.innerHTML = dynamicCSS;
}
