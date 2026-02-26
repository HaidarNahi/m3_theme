import frappe

def create_language_item_doctype():
    doctype_name = "M3 Language Switcher Item"
    if not frappe.db.exists("DocType", doctype_name):
        doc = frappe.get_doc({
            "doctype": "DocType",
            "name": doctype_name,
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
                    "reqd": 1
                }
            ]
        })
        doc.insert(ignore_permissions=True)
        print("Created DocType:", doctype_name)

def execute():
    create_language_item_doctype()
