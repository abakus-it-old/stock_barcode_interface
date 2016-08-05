from openerp import models

class stock_pack_operation_stock_barcode_interface(models.Model):
    _inherit = 'stock.pack.operation'

    def _search_and_increment(self, cr, uid, picking_id, domain, filter_visible=False, visible_op_ids=False, increment=True, context=None):
        '''Search for an operation with given 'domain' in a picking, if it exists increment the qty (+1) otherwise create it

        :param domain: list of tuple directly reusable as a domain
        context can receive a key 'current_package_id' with the package to consider for this operation
        returns True
        '''
        if context is None:
            context = {}

        #if current_package_id is given in the context, we increase the number of items in this package
        package_clause = [('result_package_id', '=', context.get('current_package_id', False))]
        existing_operation_ids = self.search(cr, uid, [('picking_id', '=', picking_id)] + domain + package_clause, context=context)
        todo_operation_ids = []
        if existing_operation_ids:
            if filter_visible:
                todo_operation_ids = [val for val in existing_operation_ids if val in visible_op_ids]
            else:
                todo_operation_ids = existing_operation_ids
        if todo_operation_ids:
            #existing operation found for the given domain and picking => increment its quantity
            operation_id = todo_operation_ids[0]
            op_obj = self.browse(cr, uid, operation_id, context=context)
            qty = op_obj.qty_done
            if increment:
                qty += 1
            else:
                qty -= 1 if qty >= 1 else 0
                if qty == 0 and op_obj.product_qty == 0:
                    #we have a line with 0 qty set, so delete it
                    self.unlink(cr, uid, [operation_id], context=context)
                    return False
            self.write(cr, uid, [operation_id], {'qty_done': qty}, context=context)
        else:
            #no existing operation found for the given domain and picking => create a new one
            picking_obj = self.pool.get("stock.picking")
            picking = picking_obj.browse(cr, uid, picking_id, context=context)
            values = {
                'picking_id': picking_id,
                'product_qty': 0,
                'location_id': picking.location_id.id,
                'location_dest_id': picking.location_dest_id.id,
                'qty_done': 1,
                }
            for key in domain:
                var_name, dummy, value = key
                uom_id = False
                if var_name == 'product_id':
                    uom_id = self.pool.get('product.product').browse(cr, uid, value, context=context).uom_id.id
                update_dict = {var_name: value}
                if uom_id:
                    update_dict['product_uom_id'] = uom_id
                values.update(update_dict)
            operation_id = self.create(cr, uid, values, context=context)
        return operation_id