# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe

_DOCTYPE_NAME = "M3 Language Switcher Item"


def create_language_item_doctype() -> None:
	"""Create the M3 Language Switcher Item child-table DocType if it does not exist.

	Idempotent — checks frappe.db.exists() before inserting (Frappe v16 pattern).
	"""
	if frappe.db.exists("DocType", _DOCTYPE_NAME):
		return

	frappe.get_doc({
		"doctype": "DocType",
		"name": _DOCTYPE_NAME,
		"module": "M3 Theme",
		"custom": 0,
		"istable": 1,
		"editable_grid": 1,
		"fields": [
			{
				"fieldname": "language",
				"label": "Language",
				"fieldtype": "Link",
				"options": "Language",
				"in_list_view": 1,
				"reqd": 1,
			},
		],
	}).insert(ignore_permissions=True)
	print("Created DocType:", _DOCTYPE_NAME)


def execute() -> None:
	"""Entry point called by bench migrate."""
	frappe.flags.in_install = True  # Suppress permission checks during install
	create_language_item_doctype()
