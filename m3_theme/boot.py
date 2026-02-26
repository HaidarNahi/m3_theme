# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe

def boot_session(bootinfo):
	"""Inject Theme Settings into frappe.boot so the frontend can access them synchronously on load."""
	# Wrap in try-except in case the doctype isn't fully installed yet
	try:
		settings = frappe.get_single("Theme Settings").as_dict()
		# Remove unnecessary metadata
		for key in ("modified", "creation", "modified_by", "owner", "idx", "name", "doctype"):
			settings.pop(key, None)
		bootinfo.m3_theme_settings = settings
	except Exception:
		bootinfo.m3_theme_settings = {}
