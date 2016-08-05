# -*- coding: utf-8 -*-
import logging

from openerp import http
from openerp.http import request

class BarcodeController(http.Controller):

    @http.route(['/barcode/web/'], type='http', auth='user')
    def a(self, debug=False, **k):
        if not request.session.uid:
            return http.local_redirect('/web/login?redirect=/barcode/web')

        return request.render('stock_barcode_interface.barcode_index')
