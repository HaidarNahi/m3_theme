# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe


def boot_session(bootinfo) -> None:
	"""Inject Theme Settings into frappe.boot for synchronous frontend access.

	Uses get_cached_doc (Frappe v16 recommended) to avoid a round-trip
	on every page load. Only injects fields the frontend actually uses,
	keeping the boot payload minimal.
	"""
	try:
		doc = frappe.get_cached_doc("Theme Settings", "Theme Settings")
		bootinfo.m3_theme_settings = {
			# Appearance
			"color_scheme": doc.color_scheme,
			"color_palette": doc.color_palette,
			"font_family": doc.font_family,
			"base_font_size": doc.base_font_size,
			"loading_animation": doc.loading_animation,
			# Sidebar
			"sidebar_type": doc.sidebar_type,
			"custom_sidebar_items": [
				{
					"title": row.title,
					"icon": row.icon,
					"link_type": row.link_type,
					"link_to": row.link_to,
					"is_parent": row.is_parent,
					"role_type": row.role_type,
					"roles": row.roles,
					"users": row.users,
				}
				for row in (doc.custom_sidebar_items or [])
			],
			# Navbar
			"navbar_logo": doc.navbar_logo,
			"navbar_logo_height": doc.navbar_logo_height,
			"external_link_label": doc.external_link_label,
			"external_link_url": doc.external_link_url,
			"language_switcher_items": [
				{"language": row.language}
				for row in (doc.language_switcher_items or [])
			],
			"custom_navbar_items": [
				{"element": row.element, "hidden": row.hidden}
				for row in (doc.custom_navbar_items or [])
			],
			# Profile menu
			"profile_menu_type": doc.profile_menu_type,
			"custom_profile_links": [
				{"label": row.label, "icon": row.icon, "url": row.url}
				for row in (doc.custom_profile_links or [])
			],
		}
	except Exception:
		bootinfo.m3_theme_settings = {}
