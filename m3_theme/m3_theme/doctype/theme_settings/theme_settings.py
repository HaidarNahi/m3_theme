# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ThemeSettings(Document):
	def on_update(self) -> None:
		"""Clear both the document cache and the global cache when settings are saved.

		This ensures get_cached_doc returns fresh values on the next boot_session call.
		"""
		frappe.clear_cache()
		# Also invalidate the specific cached doc so the next get_cached_doc re-fetches
		frappe.cache().hdel("last_modified", "Theme Settings")


@frappe.whitelist(allow_guest=True)
def get_theme_settings() -> dict:
	"""Public API — returns login-page styling fields only.

	Accessible to guests (unauthenticated users) so the login page can
	apply branding before the user signs in. Only returns the minimum
	fields needed for login page rendering — never exposes internal config.

	Uses get_cached_doc (Frappe v16) for efficient Single document access.
	"""
	try:
		doc = frappe.get_cached_doc("Theme Settings", "Theme Settings")
		return {
			# Login page branding
			"login_logo": doc.login_logo,
			"login_bg": doc.login_bg,
			"overlay_opacity": doc.overlay_opacity,
			"page_title": doc.page_title,
			"footer_text": doc.footer_text,
			# Minimal appearance for login page pre-auth styling
			"color_palette": doc.color_palette,
			"font_family": doc.font_family,
		}
	except Exception:
		return {}
