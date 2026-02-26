import frappe

def execute():
    # Print the languages and their actual display names
    langs = frappe.get_all("Language", fields=["name", "language_name"])
    
    mapping = {}
    for l in langs:
        mapping[l.name] = l.language_name
        
    print(mapping)
