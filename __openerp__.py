{
   'name': "Stock barcode interface",
    'version': '9.0.1.0',
    'depends': ['stock', 'stock_delivery_note_report', 'product_brand', 'deliveries_labels'],
    'author': "Bernard DELHEZ, AbAKUS it-solutions SARL",
    'website': "http://www.abakusitsolutions.eu",
    'category': 'Warehouse Management',
    'description': 
    """
Stock barcode interface
This module is based on the interface extension (odoo 8) of the warehouse module.

New delivery note report (under construction)

New menu items:
    - Incoming product:
        - (1) scan a product and select quantity (with search by EAN13)
        - (2) select incoming picking and transfer
        - (3) select outgoing picking, reserve and print labels
    - All Products (with search)
    - Moves Products: only products of incoming and outgoing picking lists (with search)
    - Incomings: incoming pickings (with search)
    - Outgoings: outgoing pickings (with search)
    - Suppliers: picking lists by supplier (with search)
    - Customers: picking lists by customer (with search)

Improvements to existing functionalities:
    - new information to the stock picking interface:
        - picking:
            - Partner
            - Creation Date
            - Scheduled Date
            - Source Document
            - State
        - stock move:
            - Availability
            - Status

This module has been developed by Bernard Delhez, intern @ AbAKUS it-solutions, under the control of Valentin Thirion.
    """,
    'data': ['view/stock.xml','view/stock_picking.xml'],
    'qweb': ['static/src/xml/picking_improvements.xml'],
}
