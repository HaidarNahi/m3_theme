# Copyright (c) 2026, Haidar Nahi and contributors
# For license information, please see license.txt

import frappe


def execute() -> None:
	"""Create M3 Theme child-table DocTypes if they do not already exist.

	Called during bench migrate. Idempotent — safe to run multiple times.
	Uses frappe.db.exists() guard before each insert to avoid duplicate-key
	errors on re-runs (Frappe v16 pattern).
	"""
	frappe.flags.in_install = True  # Suppress permission checks during install

	_create_profile_link()
	_create_navbar_item()
	_create_sidebar_item()


def _create_profile_link() -> None:
	if frappe.db.exists("DocType", "M3 Profile Link"):
		return
	print("Creating M3 Profile Link DocType...")
	frappe.get_doc({
		"doctype": "DocType",
		"name": "M3 Profile Link",
		"module": "M3 Theme",
		"custom": 0,
		"istable": 1,
		"fields": [
			{
				"fieldname": "label",
				"fieldtype": "Data",
				"label": "Link Text",
				"in_list_view": 1,
				"reqd": 1,
			},
			{
				"fieldname": "icon",
				"fieldtype": "Data",
				"label": "Material Icon Name",
				"in_list_view": 1,
				"description": "e.g., 'home', 'settings'",
			},
			{
				"fieldname": "url",
				"fieldtype": "Data",
				"label": "Route / URL",
				"in_list_view": 1,
				"reqd": 1,
			},
		],
	}).insert(ignore_permissions=True)
	print("M3 Profile Link created.")


def _create_navbar_item() -> None:
	if frappe.db.exists("DocType", "M3 Navbar Item"):
		return
	print("Creating M3 Navbar Item DocType...")
	frappe.get_doc({
		"doctype": "DocType",
		"name": "M3 Navbar Item",
		"module": "M3 Theme",
		"custom": 0,
		"istable": 1,
		"fields": [
			{
				"fieldname": "element",
				"fieldtype": "Data",
				"label": "Element",
				"in_list_view": 1,
				"read_only": 1,
				"reqd": 1,
			},
			{
				"fieldname": "hidden",
				"fieldtype": "Check",
				"label": "Hidden",
				"in_list_view": 1,
				"default": 0,
			},
		],
	}).insert(ignore_permissions=True)
	print("M3 Navbar Item created.")


def _create_sidebar_item() -> None:
	if frappe.db.exists("DocType", "M3 Sidebar Item"):
		return
	print("Creating M3 Sidebar Item DocType...")
	frappe.get_doc({
		"doctype": "DocType",
		"name": "M3 Sidebar Item",
		"module": "M3 Theme",
		"custom": 0,
		"istable": 1,
		"fields": [
			{
				"fieldname": "title",
				"fieldtype": "Data",
				"label": "Title",
				"in_list_view": 1,
				"reqd": 1,
			},
			{
				"fieldname": "icon",
				"fieldtype": "Data",
				"label": "Material Icon",
				"in_list_view": 1,
				"description": "e.g., 'home'",
			},
			{
				"fieldname": "link_type",
				"fieldtype": "Select",
				"label": "Link Type",
				"options": "DocType\nPage\nReport\nWorkspace\nURL",
				"default": "Workspace",
				"in_list_view": 1,
			},
			{
				"fieldname": "link_to",
				"fieldtype": "Data",
				"label": "Link to..",
				"in_list_view": 1,
				"reqd": 1,
			},
			{
				"fieldname": "is_parent",
				"fieldtype": "Check",
				"label": "Is Parent",
				"default": 0,
			},
			{
				"fieldname": "cb_01",
				"fieldtype": "Column Break",
			},
			{
				"fieldname": "role_type",
				"fieldtype": "Select",
				"label": "Role Type",
				"options": "All\nCustom Roles\nCustom Users",
				"default": "All",
			},
			{
				"fieldname": "roles",
				"fieldtype": "Small Text",
				"label": "Roles",
				"description": "Comma separated role names",
				"depends_on": "eval:doc.role_type == 'Custom Roles'",
			},
			{
				"fieldname": "users",
				"fieldtype": "Small Text",
				"label": "Users",
				"description": "Comma separated user emails",
				"depends_on": "eval:doc.role_type == 'Custom Users'",
			},
		],
	}).insert(ignore_permissions=True)
	print("M3 Sidebar Item created.")
