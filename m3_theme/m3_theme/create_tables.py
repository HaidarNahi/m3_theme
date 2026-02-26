import frappe

def execute():
    print("Creating Profile Link Doctype...")
    if not frappe.db.exists("DocType", "M3 Profile Link"):
        doc = frappe.get_doc({
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
                    "reqd": 1
                },
                {
                    "fieldname": "icon",
                    "fieldtype": "Data",
                    "label": "Material Icon Name",
                    "in_list_view": 1,
                    "description": "e.g., 'home', 'settings'"
                },
                {
                    "fieldname": "url",
                    "fieldtype": "Data",
                    "label": "Route / URL",
                    "in_list_view": 1,
                    "reqd": 1
                }
            ]
        })
        doc.insert(ignore_permissions=True)
        print("M3 Profile Link created.")

    print("Creating Sidebar Item Doctype...")
    if not frappe.db.exists("DocType", "M3 Sidebar Item"):
        doc2 = frappe.get_doc({
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
                    "reqd": 1
                },
                {
                    "fieldname": "icon",
                    "fieldtype": "Data",
                    "label": "Material Icon",
                    "in_list_view": 1,
                    "description": "e.g., 'home'"
                },
                {
                    "fieldname": "link_type",
                    "fieldtype": "Select",
                    "label": "Link Type",
                    "options": "DocType\nPage\nReport\nWorkspace\nURL",
                    "default": "Workspace",
                    "in_list_view": 1
                },
                {
                    "fieldname": "link_to",
                    "fieldtype": "Data",
                    "label": "Link to..",
                    "in_list_view": 1,
                    "reqd": 1
                },
                {
                    "fieldname": "is_parent",
                    "fieldtype": "Check",
                    "label": "Is Parent",
                    "default": 0
                },
                {
                    "fieldname": "cb_01",
                    "fieldtype": "Column Break"
                },
                {
                    "fieldname": "role_type",
                    "fieldtype": "Select",
                    "label": "Role Type",
                    "options": "All\nCustom Roles\nCustom Users",
                    "default": "All"
                },
                {
                    "fieldname": "roles",
                    "fieldtype": "Small Text",
                    "label": "Roles",
                    "description": "Comma separated role names",
                    "depends_on": "eval:doc.role_type == 'Custom Roles'"
                },
                {
                    "fieldname": "users",
                    "fieldtype": "Small Text",
                    "label": "Users",
                    "description": "Comma separated user emails",
                    "depends_on": "eval:doc.role_type == 'Custom Users'"
                }
            ]
        })
        doc2.insert(ignore_permissions=True)
        print("M3 Sidebar Item created.")
