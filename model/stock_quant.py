from openerp import models
from openerp.tools.float_utils import float_compare

class stock_quant_stock_barcode_interface(models.Model):
    _inherit = 'stock.quant'

    def quants_get_prefered_domain(self, cr, uid, location, product, qty, domain=None, prefered_domain_list=[], restrict_lot_id=False, restrict_partner_id=False, context=None):
        ''' This function tries to find quants in the given location for the given domain, by trying to first limit
            the choice on the quants that match the first item of prefered_domain_list as well. But if the qty requested is not reached
            it tries to find the remaining quantity by looping on the prefered_domain_list (tries with the second item and so on).
            Make sure the quants aren't found twice => all the domains of prefered_domain_list should be orthogonal
        '''
        if domain is None:
            domain = []
        quants = [(None, qty)]
        #don't look for quants in location that are of type production, supplier or inventory.
        if location.usage in ['inventory', 'production', 'supplier']:
            return quants
        res_qty = qty
        if not prefered_domain_list:
            return self.quants_get(cr, uid, location, product, qty, domain=domain, restrict_lot_id=restrict_lot_id, restrict_partner_id=restrict_partner_id, context=context)
        for prefered_domain in prefered_domain_list:
            res_qty_cmp = float_compare(res_qty, 0, precision_rounding=product.uom_id.rounding)
            if res_qty_cmp > 0:
                #try to replace the last tuple (None, res_qty) with something that wasn't chosen at first because of the prefered order
                quants.pop()
                tmp_quants = self.quants_get(cr, uid, location, product, res_qty, domain=domain + prefered_domain, restrict_lot_id=restrict_lot_id, restrict_partner_id=restrict_partner_id, context=context)
                for quant in tmp_quants:
                    if quant[0]:
                        res_qty -= quant[1]
                quants += tmp_quants
        return quants