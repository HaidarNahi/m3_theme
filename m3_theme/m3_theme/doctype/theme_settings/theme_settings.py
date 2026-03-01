# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ThemeSettings(Document):
	def on_update(self):
		"""Clear cache when settings are saved so the new settings are served immediately."""
		frappe.clear_cache()


@frappe.whitelist(allow_guest=True)
def get_theme_settings():
    """Public API — returns the full settings dict. Accessible to guests for styling the login page."""
    return frappe.get_single("Theme Settings").as_dict()
