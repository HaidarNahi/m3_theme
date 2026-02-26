# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ThemeSettings(Document):
	def on_update(self):
		"""Clear cache when settings are saved so the new settings are served immediately."""
		frappe.clear_cache()

	@frappe.whitelist()
	def get_theme_settings(self):
		"""Public API — returns the full settings dict (called by frontend JS)."""
		return frappe.get_single("Theme Settings").as_dict()
