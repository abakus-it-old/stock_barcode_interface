function openerp_picking_widgets(instance){

    var module = instance.stock;
    var _t     = instance.web._t;
    var QWeb   = instance.web.qweb;

    // This widget makes sure that the scaling is disabled on mobile devices.
    // Widgets that want to display fullscreen on mobile phone need to extend this
    // widget.

    module.MobileWidget = instance.web.Widget.extend({
        start: function(){
            if(!$('#oe-mobilewidget-viewport').length){
                $('head').append('<meta id="oe-mobilewidget-viewport" name="viewport" content="initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">');
            }
            return this._super();
        },
        destroy: function(){
            $('#oe-mobilewidget-viewport').remove();
            return this._super();
        },
    });
    
    module.PageWidget = instance.web.Widget.extend({
        template: 'PageWidget',
        init: function(parent,params){
            this._super(parent,params);
            var self = this;
            this.change = false;
            $(window).bind('hashchange', function(){
                $('body').off('keypress');
                var states = $.bbq.getState();
                if (states.action === "stock.products" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.products',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.menu"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.menu',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.product" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.product',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.ui"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.ui',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.pickinglist" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.pickinglist',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.partnerList" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.partnerList',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.partnerMoves" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.partnerMoves',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.incomingProduct"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.incomingProduct',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.collectAndGo"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.collectAndGo',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                self.change = false;

            });
        },
        start: function(){
            instance.webclient.set_content_full_screen(true);
            var self = this;
            this.$('.js_pick_quit').click(function(){ self.quit(); });
            this.$('.js_pick_menu').click(function(){ self.menu(); });
            this.$('.js_pick_products').click(function(event){  self.change = true; self.goto_products(); });
            this.$('.js_pick_moves_products').click(function(event){  self.change = true; self.goto_moves_products(); });
            this.$('.js_pick_incomings').click(function(event){  self.change = true; self.goto_incomings(); });
            this.$('.js_pick_outgoings').click(function(event){  self.change = true; self.goto_outgoings(); });
            this.$('.js_pick_customers').click(function(event){  self.change = true; self.goto_customers(); });
            this.$('.js_pick_suppliers').click(function(event){  self.change = true; self.goto_suppliers();  });
            this.$('.js_pick_incoming_product').click(function(event){ self.goto_incoming_product();});
            this.$('.js_pick_collect_and_go').click(function(event){ self.goto_collect_and_go();});

        },
        
        menu: function(){
            $.bbq.pushState('#action=stock.menu');
            $(window).trigger('hashchange');
        },
        goto_products: function(){
            $.bbq.pushState('#action=stock.products');
            $(window).trigger('hashchange');
        },
        goto_moves_products: function(){
            $.bbq.pushState('#action=stock.products&filter=moves');
            $(window).trigger('hashchange');
        },
        goto_incomings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=incoming');
            $(window).trigger('hashchange');
        },
        goto_outgoings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=outgoing',2);
            $(window).trigger('hashchange');
        },
        goto_customers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=customer');
            $(window).trigger('hashchange');
        },
        goto_suppliers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=supplier');
            $(window).trigger('hashchange');
        },
        goto_incoming_product: function(){
            $.bbq.pushState('#action=stock.incomingProduct');
            $(window).trigger('hashchange');
        },
        goto_collect_and_go: function(){
            $.bbq.pushState('#action=stock.collectAndGo');
            $(window).trigger('hashchange');
        },
        quit: function(){
            this.destroy();
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'stock_picking_type_action']], ['res_id']).pipe(function(res) {
                    window.location = '/web#action=' + res[0]['res_id'];
                });
        },
        destroy: function(){
            this._super();
            instance.webclient.set_content_full_screen(false);
        },
        refresh_nav_clicked_btn: function(clicked_button_class){
            $(".nav_clicked_btn").each(function() {
                $(this).css( "background-color", "" );
            });
            $(clicked_button_class).css("background-color","orange");
        },
    });


    module.PickingEditorWidget = instance.web.Widget.extend({
        //modified
        template: 'PickingEditorNewWidget',
        init: function(parent,options){
            this._super(parent,options);
            var self = this;
            this.rows = [];
            this.search_filter = "";
            jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
                return function( elem ) {
                    return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
                };
            });
        },
        get_header: function(){
            return this.getParent().get_header();
        },
        get_header_info: function(){
            return this.getParent().get_header_info();
        },
        get_picking: function(){
            return this.getParent().get_picking();
        },
        get_location: function(){
            var model = this.getParent();
            var locations = [];
            var self = this;
            _.each(model.locations, function(loc){
                locations.push({name: loc.complete_name, id: loc.id,});
            });
            return locations;
        },
        get_logisticunit: function(){
            var model = this.getParent();
            var ul = [];
            var self = this;
            _.each(model.uls, function(ulog){
                ul.push({name: ulog.name, id: ulog.id,});
            });
            return ul;
        },
        get_rows: function(){
            var model = this.getParent();
            this.rows = [];
            var self = this;
            var pack_created = [];
            _.each( model.packoplines, function(packopline){
                    var pack = undefined;
                    var color = "";
                    if (packopline.product_id[1] !== undefined){ pack = packopline.package_id[1];}
                    if (packopline.product_qty == packopline.qty_done){ color = "success "; }
                    if (packopline.product_qty < packopline.qty_done){ color = "danger "; }
                    //also check that we don't have a line already existing for that package
                    if (packopline.result_package_id[1] !== undefined && $.inArray(packopline.result_package_id[0], pack_created) === -1){
                        var myPackage = $.grep(model.packages, function(e){ return e.id == packopline.result_package_id[0]; })[0];
                        self.rows.push({
                            cols: { product: packopline.result_package_id[1],
                                    qty: '',
                                    rem: '',
                                    uom: undefined,
                                    lot: undefined,
                                    pack: undefined,
                                    container: packopline.result_package_id[1] ? true : false,
                                    container_id: undefined,
                                    loc: packopline.location_id[1],
                                    dest: packopline.location_dest_id[1],
                                    state: '',
                                    availability: '',
                                    id: packopline.result_package_id[0],
                                    product_id: undefined,
                                    can_scan: false,
                                    head_container: true,
                                    processed: packopline.processed ? true : false,
                                    package_id: myPackage.id,
                                    ul_id: myPackage.ul_id[0],
                            },
                            classes: ('success container_head ') + (packopline.processed === "true" ? 'processed hidden ':''),
                        });
                        pack_created.push(packopline.result_package_id[0]);
                    }
                    self.rows.push({
                        cols: { product: packopline.product_id[1] || packopline.package_id[1],
                                qty: packopline.product_qty,
                                rem: packopline.qty_done,
                                uom: packopline.product_uom_id[1],
                                lot: 'lot',//packopline.lot_id[1],
                                pack: pack,
                                container: packopline.result_package_id[1] ? true : false,
                                container_id: packopline.result_package_id[0],
                                loc: packopline.location_id[1],
                                dest: packopline.location_dest_id[1],
                                state: packopline.stock_move ? packopline.stock_move.state : "",
                                availability: packopline.stock_move ? packopline.stock_move.string_availability_info : "",
                                id: packopline.id,
                                product_id: packopline.product_id[0],
                                can_scan: packopline.result_package_id[1] === undefined ? true : false,
                                head_container: false,
                                processed: packopline.processed ? true : false,
                                package_id: undefined,
                                ul_id: -1,
                        },
                        classes: color + (packopline.result_package_id[1] !== undefined ? 'in_container_hidden ' : '') + (packopline.processed === "true" ? 'processed hidden ':''),
                    });
            });
            //sort element by things to do, then things done, then grouped by packages
            group_by_container = _.groupBy(self.rows, function(row){
                return row.cols.container;
            });
            var sorted_row = [];
            if (group_by_container.undefined !== undefined){
                group_by_container.undefined.sort(function(a,b){return (b.classes === '') - (a.classes === '');});
                $.each(group_by_container.undefined, function(key, value){
                    sorted_row.push(value);
                });
            }

            $.each(group_by_container, function(key, value){
                if (key !== 'undefined'){
                    $.each(value, function(k,v){
                        sorted_row.push(v);
                    });
                }
            });

            return sorted_row;
        },
        renderElement: function(){
            var self = this;
            this._super();
            this.check_content_screen();
            this.$('.js_pick_done').click(function(){ self.getParent().done(); });
            this.$('.js_pick_print_all').click(function() {
                // Print the picking list 2 times and the labels in a single press
                self.getParent().print_picking();
                self.getParent().print_picking();
                self.getParent().print_picking_labels();
            });
            this.$('.js_pick_print').click(function() {
            	self.getParent().print_picking();
            });
            this.$('.js_pick_print_two_times').click(function() {
            	// Print the picking list two times
            	self.getParent().print_picking();
            	self.getParent().print_picking();
            });
            this.$('.js_pick_print_labels').click(function(){ self.getParent().print_picking_labels(); });
            this.$('.js_print_label').click(function(){
                self.getParent().print_label($(this).data('id')); 
            });
            this.$('.oe_pick_app_header').text(self.get_header());
            this.$('.oe_searchbox').keyup(function(event){
                self.on_searchbox($(this).val());
            });
            this.$('.js_putinpack').click(function(){ self.getParent().pack(); });
            this.$('.js_drop_down').click(function(){ self.getParent().drop_down();});
            this.$('.js_clear_search').click(function(){
                self.on_searchbox('');
                self.$('.oe_searchbox').val('');
            });
            this.$('.oe_searchbox').focus(function(){
                self.getParent().barcode_scanner.disconnect();
            });
            this.$('.oe_searchbox').blur(function(){
                self.getParent().barcode_scanner.connect(function(ean){
                    self.get_Parent().scan(ean);
                });
            })
            this.$('#js_select').change(function(){
                var selection = self.$('#js_select option:selected').attr('value');
                if (selection === "ToDo"){
                    self.getParent().$('.js_pick_pack').removeClass('hidden')
                    self.getParent().$('.js_drop_down').removeClass('hidden')
                    self.$('.js_pack_op_line.processed').addClass('hidden')
                    self.$('.js_pack_op_line:not(.processed)').removeClass('hidden')
                }
                else{
                    self.getParent().$('.js_pick_pack').addClass('hidden')
                    self.getParent().$('.js_drop_down').addClass('hidden')
                    self.$('.js_pack_op_line.processed').removeClass('hidden')
                    self.$('.js_pack_op_line:not(.processed)').addClass('hidden')
                }
                self.on_searchbox(self.search_filter);
            });
            this.$('.js_plus').click(function(){
                var id = $(this).data('product-id');
                var op_id = $(this).parents("[data-id]:first").data('id');
                self.getParent().scan_product_id(id,true,op_id);
            });
            this.$('.js_minus').click(function(){
                var id = $(this).data('product-id');
                var op_id = $(this).parents("[data-id]:first").data('id');
                self.getParent().scan_product_id(id,false,op_id);
            });
            this.$('.js_unfold').click(function(){
                var op_id = $(this).parent().data('id');
                var line = $(this).parent();
                //select all js_pack_op_line with class in_container_hidden and correct container-id
                select = self.$('.js_pack_op_line.in_container_hidden[data-container-id='+op_id+']')
                if (select.length > 0){
                    //we unfold
                    line.addClass('warning');
                    select.removeClass('in_container_hidden');
                    select.addClass('in_container');
                }
                else{
                    //we fold
                    line.removeClass('warning');
                    select = self.$('.js_pack_op_line.in_container[data-container-id='+op_id+']')
                    select.removeClass('in_container');
                    select.addClass('in_container_hidden');
                }
            });
            this.$('.js_create_lot').click(function(){
                var op_id = $(this).parents("[data-id]:first").data('id');
                var lot_name = false;
                self.$('.js_lot_scan').val('');
                var $lot_modal = self.$el.siblings('#js_LotChooseModal');
                //disconnect scanner to prevent scanning a product in the back while dialog is open
                self.getParent().barcode_scanner.disconnect();
                $lot_modal.modal()
                //focus input
                $lot_modal.on('shown.bs.modal', function(){
                    self.$('.js_lot_scan').focus();
                })
                //reactivate scanner when dialog close
                $lot_modal.on('hidden.bs.modal', function(){
                    self.getParent().barcode_scanner.connect(function(ean){
                        self.getParent().scan(ean);
                    });
                })
                self.$('.js_lot_scan').focus();
                //button action
                self.$('.js_validate_lot').click(function(){
                    //get content of input
                    var name = self.$('.js_lot_scan').val();
                    if (name.length !== 0){
                        lot_name = name;
                    }
                    $lot_modal.modal('hide');
                    //we need this here since it is not sure the hide event
                    //will be catch because we refresh the view after the create_lot call
                    self.getParent().barcode_scanner.connect(function(ean){
                        self.getParent().scan(ean);
                    });
                    self.getParent().create_lot(op_id, lot_name);
                });
            });
            this.$('.js_delete_pack').click(function(){
                var pack_id = $(this).parents("[data-id]:first").data('id');
                self.getParent().delete_package_op(pack_id);
            });
            this.$('.js_print_pack').click(function(){
                var pack_id = $(this).parents("[data-id]:first").data('id');
                // $(this).parents("[data-id]:first").data('id')
                self.getParent().print_package(pack_id);
            });
            this.$('.js_submit_value').submit(function(event){
                var op_id = $(this).parents("[data-id]:first").data('id');
                var value = parseFloat($("input", this).val());
                if (value>=0){
                    self.getParent().set_operation_quantity(value, op_id);
                }
                $("input", this).val("");
                return false;
            });
            this.$('.js_qty').focus(function(){
                self.getParent().barcode_scanner.disconnect();
            });
            this.$('.js_qty').blur(function(){
                var op_id = $(this).parents("[data-id]:first").data('id');
                var value = parseFloat($(this).val());
                if (value>=0){
                    self.getParent().set_operation_quantity(value, op_id);
                }
                
                self.getParent().barcode_scanner.connect(function(ean){
                    self.getParent().scan(ean);
                });
            });
            this.$('.js_change_src').click(function(){
                var op_id = $(this).parents("[data-id]:first").data('id');//data('op_id');
                self.$('#js_loc_select').addClass('source');
                self.$('#js_loc_select').data('op-id',op_id);
                self.$el.siblings('#js_LocationChooseModal').modal();
            });
            this.$('.js_change_dst').click(function(){
                var op_id = $(this).parents("[data-id]:first").data('id');
                self.$('#js_loc_select').data('op-id',op_id);
                self.$el.siblings('#js_LocationChooseModal').modal();
            });
            this.$('.js_pack_change_dst').click(function(){
                var op_id = $(this).parents("[data-id]:first").data('id');
                self.$('#js_loc_select').addClass('pack');
                self.$('#js_loc_select').data('op-id',op_id);
                self.$el.siblings('#js_LocationChooseModal').modal();
            });
            this.$('.js_validate_location').click(function(){
                //get current selection
                var select_dom_element = self.$('#js_loc_select');
                var loc_id = self.$('#js_loc_select option:selected').data('loc-id');
                var src_dst = false;
                var op_id = select_dom_element.data('op-id');
                if (select_dom_element.hasClass('pack')){
                    select_dom_element.removeClass('source');
                    op_ids = [];
                    self.$('.js_pack_op_line[data-container-id='+op_id+']').each(function(){
                        op_ids.push($(this).data('id'));
                    });
                    op_id = op_ids;
                }
                else if (select_dom_element.hasClass('source')){
                    src_dst = true;
                    select_dom_element.removeClass('source');
                }
                if (loc_id === false){
                    //close window
                    self.$el.siblings('#js_LocationChooseModal').modal('hide');
                }
                else{
                    self.$el.siblings('#js_LocationChooseModal').modal('hide');
                    self.getParent().change_location(op_id, parseInt(loc_id), src_dst);

                }
            });
            this.$('.js_pack_configure').click(function(){
                var pack_id = $(this).parents(".js_pack_op_line:first").data('package-id');
                var ul_id = $(this).parents(".js_pack_op_line:first").data('ulid');
                self.$('#js_packconf_select').val(ul_id);
                self.$('#js_packconf_select').data('pack-id',pack_id);
                self.$el.siblings('#js_PackConfModal').modal();
            });
            this.$('.js_validate_pack').click(function(){
                //get current selection
                var select_dom_element = self.$('#js_packconf_select');
                var ul_id = self.$('#js_packconf_select option:selected').data('ul-id');
                var pack_id = select_dom_element.data('pack-id');
                self.$el.siblings('#js_PackConfModal').modal('hide');
                if (pack_id){
                    self.getParent().set_package_pack(pack_id, ul_id);
                    $('.container_head[data-package-id="'+pack_id+'"]').data('ulid', ul_id);
                }
            });
            
            //remove navigtion bar from default openerp GUI
            $('td.navbar').html('<div></div>');
        },
        on_searchbox: function(query){
            //hide line that has no location matching the query and highlight location that match the query
            this.search_filter = query;
            var processed = ".processed";
            if (this.$('#js_select option:selected').attr('value') == "ToDo"){
                processed = ":not(.processed)";
            }
            if (query !== '') {
                this.$('.js_loc:not(.js_loc:Contains('+query+'))').removeClass('info');
                this.$('.js_loc:Contains('+query+')').addClass('info');
                this.$('.js_pack_op_line'+processed+':not(.js_pack_op_line:has(.js_loc:Contains('+query+')))').addClass('hidden');
                this.$('.js_pack_op_line'+processed+':has(.js_loc:Contains('+query+'))').removeClass('hidden');
            }
            //if no query specified, then show everything
            if (query === '') {
                this.$('.js_loc').removeClass('info');
                this.$('.js_pack_op_line'+processed+'.hidden').removeClass('hidden');
            }
            this.check_content_screen();
        },
        check_content_screen: function(){
            //get all visible element and if none has positive qty, disable put in pack and process button
            var self = this;
            var processed = this.$('.js_pack_op_line.processed');
            var qties = this.$('.js_pack_op_line:not(.processed):not(.hidden) .js_qty').map(function(){return $(this).val()});
            var container = this.$('.js_pack_op_line.container_head:not(.processed):not(.hidden)')
            var disabled = true;
            $.each(qties,function(index, value){
                if (parseInt(value)>0){
                    disabled = false;
                }
            });

            if (disabled){
                if (container.length===0){
                    self.$('.js_drop_down').addClass('disabled');
                }
                else {
                    self.$('.js_drop_down').removeClass('disabled');
                }
                self.$('.js_pick_pack').addClass('disabled');
                if (processed.length === 0){
                    self.$('.js_pick_done').addClass('disabled');
                }
                else {
                    self.$('.js_pick_done').removeClass('disabled');
                }
            }
            else{
                self.$('.js_drop_down').removeClass('disabled');
                self.$('.js_pick_pack').removeClass('disabled');
                self.$('.js_pick_done').removeClass('disabled');
            }
        },
        get_current_op_selection: function(ignore_container){
            //get ids of visible on the screen
            pack_op_ids = []
            this.$('.js_pack_op_line:not(.processed):not(.js_pack_op_line.hidden):not(.container_head)').each(function(){
                cur_id = $(this).data('id');
                pack_op_ids.push(parseInt(cur_id));
            });
            //get list of element in this.rows where rem > 0 and container is empty is specified
            list = []
            _.each(this.rows, function(row){
                if (row.cols.rem > 0 && (ignore_container || row.cols.container === undefined)){
                    list.push(row.cols.id);
                }
            });
            //return only those visible with rem qty > 0 and container empty
            return _.intersection(pack_op_ids, list);
        },
        remove_blink: function(){
            this.$('.js_pack_op_line.blink_me').removeClass('blink_me');
        },
        blink: function(op_id){
            this.$('.js_pack_op_line[data-id="'+op_id+'"]').addClass('blink_me');
        },
        check_done: function(){
            var model = this.getParent();
            var self = this;
            var done = true;
            _.each( model.packoplines, function(packopline){
                if (packopline.processed === "false"){
                    done = false;
                    return done;
                }
            });
            return done;
        },
        get_visible_ids: function(){
            var self = this;
            var visible_op_ids = []
            var op_ids = this.$('.js_pack_op_line:not(.processed):not(.hidden):not(.container_head):not(.in_container):not(.in_container_hidden)').map(function(){
                return $(this).data('id');
            });
            $.each(op_ids, function(key, op_id){
                visible_op_ids.push(parseInt(op_id));
            });
            return visible_op_ids;
        },
    });

    
    
    
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    
    
    
    module.PickingMenuWidget = module.MobileWidget.extend({
        template: 'PickingMenuNewWidget',
        init: function(parent, params){
            this._super(parent,params);
            var self = this;
            /*
            $(window).bind('hashchange', function(){
                var states = $.bbq.getState();
                if (states.action === "stock.ui"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.ui',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.products"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.products',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.menu"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.menu',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.pickinglist"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.pickinglist',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.partnerList"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.partnerList',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.incomingProduct"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.incomingProduct',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.collectAndGo"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.collectAndGo',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
            });
            */
            this.picking_types = [];
            this.loaded = this.load();
            this.scanning_type = 0;
            this.barcode_scanner = new module.BarcodeScanner();
            this.pickings_by_type = {};
            this.pickings_by_id = {};
            this.picking_search_string = "";
        },
        load: function(){
            var self = this;
            return new instance.web.Model('stock.picking.type').get_func('search_read')([],[])
                .then(function(types){
                    self.picking_types = types;
                    type_ids = [];
                    for(var i = 0; i < types.length; i++){
                        self.pickings_by_type[types[i].id] = [];
                        type_ids.push(types[i].id);
                    }
                    self.pickings_by_type[0] = [];

                    return new instance.web.Model('stock.picking').call('search_read',[ [['state','in', ['assigned', 'partially_available']], ['picking_type_id', 'in', type_ids]], [] ], {context: new instance.web.CompoundContext()});

                }).then(function(pickings){
                    self.pickings = pickings;
                    for(var i = 0; i < pickings.length; i++){
                        var picking = pickings[i];
                        self.pickings_by_type[picking.picking_type_id[0]].push(picking);
                        self.pickings_by_id[picking.id] = picking;
                        self.picking_search_string += '' + picking.id + ':' + (picking.name ? picking.name.toUpperCase(): '') + '\n';
                    }

                });
        },
        renderElement: function(){
            this._super();
            var self = this;
            this.$('.js_pick_quit').click(function(){ self.quit(); });
            this.$('.js_pick_scan').click(function(){ self.scan_picking($(this).data('id')); });
            this.$('.js_pick_last').click(function(){ self.goto_last_picking_of_type($(this).data('id')); });
            this.$('.js_pick_menu').click(function(){ self.menu(); });
            this.$('.js_pick_products').click(function(){ self.goto_products(); });
            this.$('.js_pick_moves_products').click(function(){ self.goto_moves_products(); });
            this.$('.js_pick_incomings').click(function(){ self.change = true; self.goto_incomings(); });
            this.$('.js_pick_outgoings').click(function(){ self.goto_outgoings(); });
            this.$('.js_pick_customers').click(function(){ self.goto_customers(); });
            this.$('.js_pick_suppliers').click(function(){ self.goto_suppliers(); });
            this.$('.js_pick_incoming_product').click(function(){ self.goto_incoming_product(); });
            this.$('.js_pick_collect_and_go').click(function(){ self.goto_collect_and_go(); });
            this.$('.oe_searchbox').keyup(function(event){
                self.on_searchbox($(this).val());
            });
            //remove navigtion bar from default openerp GUI
            $('td.navbar').html('<div></div>');
        },
        start: function(){
            this._super();
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.barcode_scanner.connect(function(barcode){
                self.on_scan(barcode);
            });
            this.loaded.then(function(){
                self.renderElement();
            });
        },
        menu: function(){
            $.bbq.pushState('#action=stock.menu');
            $(window).trigger('hashchange');
        },
        goto_products: function(){
            $.bbq.pushState('#action=stock.products');
            $(window).trigger('hashchange');
        },
        goto_moves_products: function(){
            $.bbq.pushState('#action=stock.products&filter=moves');
            $(window).trigger('hashchange');
        },
        goto_incomings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=incoming');
            $(window).trigger('hashchange');
        },
        goto_outgoings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=outgoing');
            $(window).trigger('hashchange');
        },
        goto_picking: function(picking_id){
            $.bbq.pushState('#action=stock.ui&picking_id='+picking_id);
            $(window).trigger('hashchange');
        },
        goto_last_picking_of_type: function(type_id){
            $.bbq.pushState('#action=stock.ui&picking_type_id='+type_id);
            $(window).trigger('hashchange');
        },
        goto_customers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=customer');
            $(window).trigger('hashchange');
        },
        goto_suppliers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=supplier');
            $(window).trigger('hashchange');
        },
        goto_incoming_product: function(){
            $.bbq.pushState('#action=stock.incomingProduct');
            $(window).trigger('hashchange');
        },
        goto_collect_and_go: function(){
            $.bbq.pushState('#action=stock.collectAndGo');
            $(window).trigger('hashchange');
        },
        search_picking: function(barcode){
            try {
                var re = RegExp("([0-9]+):.*?"+barcode.toUpperCase(),"gi");
            }
            catch(e) {
                //avoid crash if a not supported char is given (like '\' or ')')
	        return [];
            }

            var results = [];
            for(var i = 0; i < 100; i++){
                r = re.exec(this.picking_search_string);
                if(r){
                    var picking = this.pickings_by_id[Number(r[1])];
                    if(picking){
                        results.push(picking);
                    }
                }else{
                    break;
                }
            }
            return results;
        },
        on_scan: function(barcode){
            var self = this;
            for(var i = 0, len = this.pickings.length; i < len; i++){
                var picking = this.pickings[i];
                if(picking.name.toUpperCase() === $.trim(barcode.toUpperCase())){
                    this.goto_picking(picking.id);
                    break;
                }
            }
            this.$('.js_picking_not_found').removeClass('hidden');

            clearTimeout(this.picking_not_found_timeout);
            this.picking_not_found_timeout = setTimeout(function(){
                self.$('.js_picking_not_found').addClass('hidden');
            },2000);

        },
        on_searchbox: function(query){
            var self = this;

            clearTimeout(this.searchbox_timeout);
            this.searchbox_timout = setTimeout(function(){
                if(query){
                    self.$('.js_picking_not_found').addClass('hidden');
                    self.$('.js_picking_categories').addClass('hidden');
                    self.$('.js_picking_search_results').html(
                        QWeb.render('PickingSearchNewResults',{results:self.search_picking(query)})
                    );
                    self.$('.js_picking_search_results .oe_picking').click(function(){
                        self.goto_picking($(this).data('id'));
                    });
                    self.$('.js_picking_search_results').removeClass('hidden');
                }else{
                    self.$('.js_title_label').removeClass('hidden');
                    self.$('.js_picking_categories').removeClass('hidden');
                    self.$('.js_picking_search_results').addClass('hidden');
                }
            },100);
        },
        quit: function(){
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'stock_picking_type_action']], ['res_id']).pipe(function(res) {
                    window.location = '/web#action=' + res[0]['res_id'];
                });
        },
        destroy: function(){
            this._super();
            this.barcode_scanner.disconnect();
            instance.webclient.set_content_full_screen(false);
        },
    });
    openerp.web.client_actions.add('stock.menu', 'instance.stock.PickingMenuWidget');

    
     /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    
    module.PickingMainWidget = module.MobileWidget.extend({
        template: 'PickingMainNewWidget',
        init: function(parent,params){
            this._super(parent,params);
            var self = this;

            $(window).bind('hashchange', function(){
                var states = $.bbq.getState();
                if (states.action === "stock.menu"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.menu',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.products" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.products',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.pickinglist" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.pickinglist',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.partnerList" && self.change){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.partnerList',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.incomingProduct"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.incomingProduct',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                else if (states.action === "stock.collectAndGo"){
                    self.do_action({
                        type:   'ir.actions.client',
                        tag:    'stock.collectAndGo',
                        target: 'current',
                    },{
                        clear_breadcrumbs: true,
                    });
                }
                self.change = false;
            });

            init_hash = $.bbq.getState();
            this.picking_type_id = init_hash.picking_type_id ? init_hash.picking_type_id:0;
            this.picking_id = init_hash.picking_id ? init_hash.picking_id:undefined;
            this.picking = null;
            this.pickings = [];
            this.packoplines = null;
            this.stockmoves = null;
            this.selected_operation = { id: null, picking_id: null};
            this.packages = null;
            this.barcode_scanner = new module.BarcodeScanner();
            this.locations = [];
            this.uls = [];
            this.change = false;
            if(this.picking_id){
                this.loaded =  this.load(this.picking_id);
            }else{
                this.loaded =  this.load();
            }

        },

        // load the picking data from the server. If picking_id is undefined, it will take the first picking
        // belonging to the category
        load: function(picking_id){
            var self = this;


            function load_picking_list(type_id){
                var pickings = new $.Deferred();
                new instance.web.Model('stock.picking')
                    .call('get_next_picking_for_ui',[{'default_picking_type_id':parseInt(type_id)}])
                    .then(function(picking_ids){
                        if(!picking_ids || picking_ids.length === 0){
                            (new instance.web.Dialog(self,{
                                title: _t('No Picking Available'),
                                buttons: [{
                                    text:_t('Ok'),
                                    click: function(){
                                        self.menu();
                                    }
                                }]
                            }, _t('<p>We could not find a picking to display.</p>'))).open();

                            pickings.reject();
                        }else{
                            self.pickings = picking_ids;
                            pickings.resolve(picking_ids);
                        }
                    });

                return pickings;
            }

            // if we have a specified picking id, we load that one, and we load the picking of the same type as the active list
            if( picking_id ){
                var loaded_picking = new instance.web.Model('stock.picking')
                    .call('read',[[parseInt(picking_id)], [], new instance.web.CompoundContext()])
                    .then(function(picking){
                        self.picking = picking[0];
                        self.picking_type_id = picking[0].picking_type_id[0];
                        return load_picking_list(self.picking.picking_type_id[0]);
                    });
            }else{
                // if we don't have a specified picking id, we load the pickings belong to the specified type, and then we take
                // the first one of that list as the active picking
                var loaded_picking = new $.Deferred();
                load_picking_list(self.picking_type_id)
                    .then(function(){
                        return new instance.web.Model('stock.picking').call('read',[self.pickings[0],[], new instance.web.CompoundContext()]);
                    })
                    .then(function(picking){
                        self.picking = picking;
                        self.picking_type_id = picking.picking_type_id[0];
                        loaded_picking.resolve();
                    });
            }

            return loaded_picking.then(function(){
                    return new instance.web.Model('stock.location').call('search',[[['usage','=','internal']]]).then(function(locations_ids){
                        return new instance.web.Model('stock.location').call('read',[locations_ids, []]).then(function(locations){
                            self.locations = locations;
                        });
                    });
                }).then(function(){
                    return new instance.web.Model('stock.picking').call('check_group_pack').then(function(result){
                        return self.show_pack = result;
                    });
                }).then(function(){
                    return new instance.web.Model('stock.picking').call('check_group_lot').then(function(result){
                        return self.show_lot = result;
                    });
                }).then(function(){
                    if (self.picking.pack_operation_exist === false){
                        self.picking.recompute_pack_op = false;
                        return new instance.web.Model('stock.picking').call('do_prepare_partial',[[self.picking.id]]);
                    }
                }).then(function(){
                        return new instance.web.Model('stock.pack.operation').call('search',[[['picking_id','=',self.picking.id]]])
                }).then(function(pack_op_ids){
                        return new instance.web.Model('stock.pack.operation').call('read',[pack_op_ids, [], new instance.web.CompoundContext()])
                }).then(function(operations){
                    self.packoplines = operations;
                    var package_ids = [];

                    for(var i = 0; i < operations.length; i++){
                        if(!_.contains(package_ids,operations[i].result_package_id[0])){
                            if (operations[i].result_package_id[0]){
                                package_ids.push(operations[i].result_package_id[0]);
                            }
                        }
                    }
                    return new instance.web.Model('stock.quant.package').call('read',[package_ids, [], new instance.web.CompoundContext()])
                }).then(function(packages){
                    self.packages = packages;
                })./*then(function(){
                        return new instance.web.Model('product.ul').call('search',[[]])
                }).then(function(uls_ids){
                        return new instance.web.Model('product.ul').call('read',[uls_ids, []])
                }).then(function(uls){
                    self.uls = uls;
                }).*/then(function(){
                        return new instance.web.Model('stock.move').call('search',[[['picking_id','=',self.picking.id]]])
                }).then(function(stock_move_ids){
                        return new instance.web.Model('stock.move').call('read',[stock_move_ids, [], new instance.web.CompoundContext()])
                }).then(function(moves){
                    self.stockmoves = moves;
                    var states = {draft:"New", cancel:"Cancelled", waiting:"Waiting Another Move", confirmed:"Waiting Availability", assigned:"Available", done:"Done"};
                    for(var i = 0; i < self.packoplines.length; i++){
                        for(var j = 0; j < moves.length; j++){
                            if(self.packoplines[i].picking_id[0] == moves[j].picking_id[0] && self.packoplines[i].product_id[0] == moves[j].product_id[0]){
                                if(states.hasOwnProperty(moves[j].state)){
                                    moves[j].state = states[moves[j].state]
                                }
                                self.packoplines[i].stock_move = moves[j];
                                break;
                            }
                        }
                    }
                    return new instance.web.Model("res.partner")
                        .query(['id','name','street','zip','city','phone','parent_id'])
                        .filter([['id', '=', self.picking.partner_id[0]]])
                        .first()
                    }).then(function(ptr) {
                        self.picking.partner = ptr;
                });
        },
        start: function(){
            this._super();
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.barcode_scanner.connect(function(ean){
                self.scan(ean);
            });

            this.$('.js_pick_quit').click(function(){ self.quit(); });
            this.$('.js_pick_prev').click(function(){ self.picking_prev(); });
            this.$('.js_pick_next').click(function(){ self.picking_next(); });
            this.$('.js_pick_menu').click(function(){ self.menu(); });
            this.$('.js_pick_products').click(function(){ self.change = true; self.goto_products(); });
            this.$('.js_pick_moves_products').click(function(){ self.change = true; self.goto_moves_products(); });
            this.$('.js_pick_incomings').click(function(){ self.change = true; self.goto_incomings(); });
            this.$('.js_pick_outgoings').click(function(){ self.change = true; self.goto_outgoings(); });
            this.$('.js_pick_customers').click(function(){ self.change = true; self.goto_customers(); });
            this.$('.js_pick_suppliers').click(function(){ self.change = true; self.goto_suppliers(); });
            this.$('.js_pick_incoming_product').click(function(){ self.goto_incoming_product(); });
            this.$('.js_pick_collect_and_go').click(function(){ self.goto_collect_and_go(); });
            this.$('.js_reload_op').click(function(){ self.reload_pack_operation();});

            $.when(this.loaded).done(function(){
                self.picking_editor = new module.PickingEditorWidget(self);
                self.picking_editor.replace(self.$('.oe_placeholder_picking_editor'));

                if( self.picking.id === self.pickings[0]){
                    self.$('.js_pick_prev').addClass('disabled');
                }else{
                    self.$('.js_pick_prev').removeClass('disabled');
                }

                if( self.picking.id === self.pickings[self.pickings.length-1] ){
                    self.$('.js_pick_next').addClass('disabled');
                }else{
                    self.$('.js_pick_next').removeClass('disabled');
                }
                if (self.picking.recompute_pack_op){
                    self.$('.oe_reload_op').removeClass('hidden');
                }
                else {
                    self.$('.oe_reload_op').addClass('hidden');
                }
                if (!self.show_pack){
                    self.$('.js_pick_pack').addClass('hidden');
                }
                if (!self.show_lot){
                    self.$('.js_create_lot').addClass('hidden');
                }

            }).fail(function(error) {console.log(error);});

        },
        on_searchbox: function(query){
            var self = this;
            self.picking_editor.on_searchbox(query.toUpperCase());
        },
        // reloads the data from the provided picking and refresh the ui.
        // (if no picking_id is provided, gets the first picking in the db)
        refresh_ui: function(picking_id){
            var self = this;
            var remove_search_filter = "";
            if (self.picking.id === picking_id){
                remove_search_filter = self.$('.oe_searchbox').val();
            }
            return this.load(picking_id)
                .then(function(){
                    self.picking_editor.remove_blink();
                    self.picking_editor.renderElement();
                    if (!self.show_pack){
                        self.$('.js_pick_pack').addClass('hidden');
                    }
                    if (!self.show_lot){
                        self.$('.js_create_lot').addClass('hidden');
                    }
                    if (self.picking.recompute_pack_op){
                        self.$('.oe_reload_op').removeClass('hidden');
                    }
                    else {
                        self.$('.oe_reload_op').addClass('hidden');
                    }

                    if( self.picking.id === self.pickings[0]){
                        self.$('.js_pick_prev').addClass('disabled');
                    }else{
                        self.$('.js_pick_prev').removeClass('disabled');
                    }

                    if( self.picking.id === self.pickings[self.pickings.length-1] ){
                        self.$('.js_pick_next').addClass('disabled');
                    }else{
                        self.$('.js_pick_next').removeClass('disabled');
                    }
                    if (remove_search_filter === ""){
                        self.$('.oe_searchbox').val('');
                        self.on_searchbox('');
                    }
                    else{
                        self.$('.oe_searchbox').val(remove_search_filter);
                        self.on_searchbox(remove_search_filter);
                    }
                });
        },
        get_header: function(){
            if(this.picking){
                return this.picking.name;  
            }else{
                return '';
            }
        },
        get_header_info: function(){
            if(this.picking){
                var state = this.picking.state
                var states = {  draft:"Draft", 
                                cancel:"Cancelled", 
                                waiting:"Waiting Another Operation",
                                partially_available: "Partially Available",
                                confirmed:"Waiting Availability", 
                                assigned:"Ready to Transfer", 
                                done:"Transferred"
                             };
                             
                if(states.hasOwnProperty(state)){
                    state = states[state];
                }
                else{state ="";}
                
                var values = [];
                //values.push({key:"Partner", value:this.picking.partner_id[1], css:'font-size: 18px;font-weight: bold;'})
                values.push({key:"Source Document", value:this.picking.origin, css:'font-size: 18px;font-weight: bold;'})
                values.push({key:"Creation Date", value:this.picking.date,css:''})
                values.push({key:"Scheduled Date", value:this.picking.min_date, css:''})
                values.push({key:"State", value:state, css:''})
             
                return values;
            }else{
                return [];
            }
        },
        get_picking: function(){
            return this.picking;
        },
        menu: function(){
            $.bbq.pushState('#action=stock.menu');
            $(window).trigger('hashchange');
        },
        goto_products: function(){
            $.bbq.pushState('#action=stock.products');
            $(window).trigger('hashchange');
        },
        goto_moves_products: function(){
            $.bbq.pushState('#action=stock.products&filter=moves');
            $(window).trigger('hashchange');
        },
        goto_incomings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=incoming');
            $(window).trigger('hashchange');
        },
        goto_outgoings: function(){
            $.bbq.pushState('#action=stock.pickinglist&type=outgoing');
            $(window).trigger('hashchange');
        },
        goto_customers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=customer');
            $(window).trigger('hashchange');
        },
        goto_suppliers: function(){
            $.bbq.pushState('#action=stock.partnerList&type=supplier');
            $(window).trigger('hashchange');
        },
        goto_incoming_product: function(){
            $.bbq.pushState('#action=stock.incomingProduct');
            $(window).trigger('hashchange');
        },
        goto_incoming_product: function(){
            $.bbq.pushState('#action=stock.incomingProduct');
            $(window).trigger('hashchange');
        },
        goto_collect_and_go: function(){
            $.bbq.pushState('#action=stock.collectAndGo');
            $(window).trigger('hashchange');
        },
        scan: function(ean){ //scans a barcode, sends it to the server, then reload the ui
            //for barcode barcodes with 12 characters
            ean = String(ean)
            if(ean.length<13){
                for(var i = 0 ; i<13-ean.length ; ++i){
                    ean = "0"+ean;
                }
            }
            var self = this;
            var product_visible_ids = this.picking_editor.get_visible_ids();
            return new instance.web.Model('stock.picking')
                .call('process_barcode_from_ui', [self.picking.id, ean, product_visible_ids])
                .then(function(result){
                    if (result.filter_loc !== false){
                        //check if we have receive a location as answer
                        if (result.filter_loc !== undefined){
                            var modal_loc_hidden = self.$('#js_LocationChooseModal').attr('aria-hidden');
                            if (modal_loc_hidden === "false"){
                                var line = self.$('#js_LocationChooseModal .js_loc_option[data-loc-id='+result.filter_loc_id+']').attr('selected','selected');
                            }
                            else{
                                self.$('.oe_searchbox').val(result.filter_loc);
                                self.on_searchbox(result.filter_loc);
                            }
                        }
                    }
                    if (result.operation_id !== false){
                        self.refresh_ui(self.picking.id).then(function(){
                            return self.picking_editor.blink(result.operation_id);
                        });
                    }
                });
        },
        scan_product_id: function(product_id,increment,op_id){ //performs the same operation as a scan, but with product id instead
            var self = this;
            return new instance.web.Model('stock.picking')
                .call('process_product_id_from_ui', [self.picking.id, product_id, op_id, increment])
                .then(function(result){
                    return self.refresh_ui(self.picking.id);
                });
        },
        pack: function(){
            var self = this;
            var pack_op_ids = self.picking_editor.get_current_op_selection(false);
            if (pack_op_ids.length !== 0){
                return new instance.web.Model('stock.picking')
                    .call('action_pack',[[[self.picking.id]], pack_op_ids])
                    .then(function(pack){
                        //TODO: the functionality using current_package_id in context is not needed anymore
                        instance.session.user_context.current_package_id = false;
                        return self.refresh_ui(self.picking.id);
                    });
            }
        },
        drop_down: function(){
            var self = this;
            var pack_op_ids = self.picking_editor.get_current_op_selection(true);
            if (pack_op_ids.length !== 0){
                return new instance.web.Model('stock.pack.operation')
                    .call('action_drop_down', [pack_op_ids])
                    .then(function(){
                            return self.refresh_ui(self.picking.id).then(function(){
                                if (self.picking_editor.check_done()){
                                    return self.done();
                                }
                            });
                    });
            }
        },
        done: function(){
            var self = this;
            return new instance.web.Model('stock.picking')
                .call('action_done_from_ui',[self.picking.id, {'default_picking_type_id': self.picking_type_id}])
                .then(function(new_picking_ids){
                    if (new_picking_ids){
                        return self.refresh_ui(new_picking_ids[0]);
                    }
                    else {
                        return 0;
                    }
                });
        },
        create_lot: function(op_id, lot_name){
            var self = this;
            return new instance.web.Model('stock.pack.operation')
                .call('create_and_assign_lot',[parseInt(op_id), lot_name])
                .then(function(){
                    return self.refresh_ui(self.picking.id);
                });
        },
        change_location: function(op_id, loc_id, is_src_dst){
            var self = this;
            var vals = {'location_dest_id': loc_id};
            if (is_src_dst){
                vals = {'location_id': loc_id};
            }
            return new instance.web.Model('stock.pack.operation')
                .call('write',[op_id, vals])
                .then(function(){
                    return self.refresh_ui(self.picking.id);
                });
        },
        print_package: function(package_id){
            var self = this;
            return new instance.web.Model('stock.quant.package')
                .call('action_print',[[package_id]])
                .then(function(action){
                    return self.do_action(action);
                });
        },
        print_picking: function(){
            var self = this;
            return new instance.web.Model('stock.picking.type').call('read', [[self.picking_type_id], ['code'], new instance.web.CompoundContext()])
                .then(function(pick_type){
                    return new instance.web.Model('stock.picking').call('do_print_picking',[[self.picking.id]])
                           .then(function(action){
                                return self.do_action(action);
                           });
                });
        },
        print_picking_labels: function(){
            var self = this;
            return new instance.web.Model('stock.picking').call('print_labels',[[self.picking.id]])
               .then(function(action){
                    return self.do_action(action);
               });

        },
        print_label: function(id){
            var self = this;
            return new instance.web.Model('stock.pack.operation').call('print_label',[[id]])
               .then(function(action){
                    return self.do_action(action);
               });

        },
        picking_next: function(){
            for(var i = 0; i < this.pickings.length; i++){
                if(this.pickings[i] === this.picking.id){
                    if(i < this.pickings.length -1){
                        $.bbq.pushState('picking_id='+this.pickings[i+1]);
                        this.refresh_ui(this.pickings[i+1]);
                        return;
                    }
                }
            }
        },
        picking_prev: function(){
            for(var i = 0; i < this.pickings.length; i++){
                if(this.pickings[i] === this.picking.id){
                    if(i > 0){
                        $.bbq.pushState('picking_id='+this.pickings[i-1]);
                        this.refresh_ui(this.pickings[i-1]);
                        return;
                    }
                }
            }
        },
        delete_package_op: function(pack_id){
            var self = this;
            return new instance.web.Model('stock.pack.operation').call('search', [[['result_package_id', '=', pack_id]]])
                .then(function(op_ids) {
                    return new instance.web.Model('stock.pack.operation').call('write', [op_ids, {'result_package_id':false}])
                        .then(function() {
                            return self.refresh_ui(self.picking.id);
                        });
                });
        },
        set_operation_quantity: function(quantity, op_id){
            var self = this;
            if(quantity >= 0){
                return new instance.web.Model('stock.pack.operation')
                    .call('write',[[op_id],{'qty_done': quantity }])
                    .then(function(){
                        self.refresh_ui(self.picking.id);
                    });
            }

        },
        set_package_pack: function(package_id, pack){
            var self = this;
                return new instance.web.Model('stock.quant.package')
                    .call('write',[[package_id],{'ul_id': pack }]);
            return;
        },
        reload_pack_operation: function(){
            var self = this;
            return new instance.web.Model('stock.picking')
                .call('do_prepare_partial',[[self.picking.id]])
                .then(function(){
                    self.refresh_ui(self.picking.id);
                });
        },
        quit: function(){
            this.destroy();
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'stock_picking_type_action']], ['res_id']).pipe(function(res) {
                    window.location = '/web#action=' + res[0]['res_id'];
                });
        },
        destroy: function(){
            this._super();
            // this.disconnect_numpad();
            this.barcode_scanner.disconnect();
            instance.webclient.set_content_full_screen(false);
        },
    });
    openerp.web.client_actions.add('stock.ui', 'instance.stock.PickingMainWidget');



    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


    module.PickingProductsWidget = module.PageWidget.extend({
        init: function(parent, params){
            this._super(parent,params);

            init_hash = $.bbq.getState();
            this.product_filter = init_hash.filter ? String(init_hash.filter): 'all';

            this.products = [];
            this.product_templates = {};
            this.loaded = this.load();
            this.products_by_id = {};
            this.product_search_string = "";

            this.picking_ids = [];
            this.product_ids = [];
        },
        load: function(){
            var self = this;
            if(self.product_filter=='all'){
                return new instance.web.Model("product.template")
                    .query(['id','product_brand_id'])
                    .filter([['type', '=', 'product']])
                    .all()
                    .then(function(product_tmpls) {
                        for(var i = 0; i < product_tmpls.length; i++){
                            var product_template = product_tmpls[i];
                            self.product_templates[product_template.id] = product_template.product_brand_id[1];
                        }

                        return new instance.web.Model("product.product")
                            .query(['id','name','barcode','default_code','product_tmpl_id'])
                            .filter([['active', '=', true]])
                            .order_by('name')
                            .all()
                    }).then(function(prods) {
                        for(var i = 0; i < prods.length; i++){
                            var product = prods[i];
                            //remove product without brand
                            //if (!self.product_templates[product.product_tmpl_id[0]]){continue;}
                            product.barcode = product.barcode ? product.barcode : ""
                            product.brand = self.product_templates[product.product_tmpl_id[0]] ? self.product_templates[product.product_tmpl_id[0]] : "";
                            self.products_by_id[product.id] = product;
                            self.products.push(product)
                        }

                        self.products.sort(function(a, b) {
                            return a.brand.localeCompare(b.brand);
                        })

                        for(var i = 0; i < self.products.length; i++){
                            var product = self.products[i];
                            self.product_search_string += '' + product.id + ':' + (product.barcode ? product.barcode.toUpperCase(): '')
                                                                                + (product.name ? product.name.toUpperCase(): '')
                                                                                + (product.brand ? product.brand.toUpperCase(): '')
                                                                                + (product.default_code ? product.default_code.toUpperCase(): '')
                                                                                + '\n';
                        }
                    });
                }
                else if(self.product_filter=='moves'){
                    return new instance.web.Model("product.template")
                    .query(['id','product_brand_id'])
                    .filter([['type', '=', 'product']])
                    .all()
                    .then(function(product_tmpls) {
                        for(var i = 0; i < product_tmpls.length; i++){
                            var product_template = product_tmpls[i];
                            self.product_templates[product_template.id] = product_template.product_brand_id[1];
                        }
                        return new instance.web.Model("stock.picking")
                            .query(['id'])
                            .filter([['state', 'in', ['assigned','partially_available']]])
                            .all()
                    }).then(function(pickings) {
                        for(var i = 0; i < pickings.length; i++){
                            self.picking_ids.push(pickings[i].id)
                        }
                        return new instance.web.Model("stock.move")
                            .query(['product_id'])
                            .filter([['picking_id', 'in', self.picking_ids]])
                            .all()
                    }).then(function(moves) {
                        for(var i = 0; i < moves.length; i++){
                            if(!(moves[i].product_id[0] in self.product_ids)){
                                self.product_ids.push(moves[i].product_id[0])
                            }
                        }
                        return new instance.web.Model("product.product")
                            .query(['id','name','barcode','default_code','product_tmpl_id'])
                            .filter([['id', 'in', self.product_ids]])
                            .order_by('name')
                            .all()
                    }).then(function(prods) {
                        for(var i = 0; i < prods.length; i++){
                            var product = prods[i];
                            //remove product without brand
                            //if (!self.product_templates[product.product_tmpl_id[0]]){continue;}
                            product.barcode = product.barcode ? product.barcode : ""
                            product.brand = self.product_templates[product.product_tmpl_id[0]] ? self.product_templates[product.product_tmpl_id[0]] : "";
                            self.products_by_id[product.id] = product;
                            self.products.push(product)
                        }

                        self.products.sort(function(a, b) {
                                return a.brand.localeCompare(b.brand);
                        })

                        for(var i = 0; i < self.products.length; i++){
                            var product = self.products[i];
                            self.product_search_string += '' + product.id + ':' + (product.barcode ? product.barcode.toUpperCase(): '')
                                                                                + (product.name ? product.name.toUpperCase(): '')
                                                                                + (product.brand ? product.brand.toUpperCase(): '')
                                                                                + (product.default_code ? product.default_code.toUpperCase(): '')
                                                                                + '\n';
                        }
                    });
                }
        },
        start_rendering: function(){
            var self = this;

            if(self.product_filter=='all'){
                this.refresh_nav_clicked_btn(".js_pick_products");
            }
            else if(self.product_filter=='moves'){
                this.refresh_nav_clicked_btn(".js_pick_moves_products");
            }

            this.$('.oe_searchbox').keyup(function(event){
                self.on_searchbox($(this).val());
            });
            this.$('#product_search_box').focus();
            self.$('.js_clear_search').click(function(){ self.$('#product_search_box').val(""); self.on_searchbox(""); self.$('#product_search_box').focus();});
            self.$('.content').html(QWeb.render('PickingProductsWidget',{products:self.products}));
            self.$('.js_products_table_todo .oe_product').click(function(){
                self.change = true;
                self.goto_product($(this).data('id'));
            });
        },
        start: function(){
            this._super()
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
               self.start_rendering();
            });
        },
        goto_product: function(product_id){
            $.bbq.pushState('#action=stock.product&product_id='+product_id);
            $(window).trigger('hashchange');
        },
        search_products: function(barcode){
            if ((_.isString(barcode) && barcode.length == 0) || (!barcode)){
                return this.products;
            }
            try {
                var re = RegExp("([0-9]+):.*?"+barcode.toUpperCase(),"gi");
            }
            catch(e) {
                //avoid crash if a not supported char is given (like '\' or ')')
	        return [];
            }

            var results = [];
            for(var i = 0; i < 100; i++){
                r = re.exec(this.product_search_string);
                if(r){
                    var product = this.products_by_id[Number(r[1])];
                    if(product){
                        results.push(product);
                    }
                }else{
                    break;
                }
            }
            return results;
        },
        on_searchbox: function(query){
            var self = this;

            clearTimeout(this.searchbox_timeout);
            this.searchbox_timout = setTimeout(function(){
                self.$('.content').html(
                        QWeb.render('PickingProductsWidget',{products:self.search_products(query)})
                    );
                self.$('.js_products_table_todo .oe_product').click(function(){
                    self.change = true;
                    self.goto_product($(this).data('id'));
                });
                if(query){
                    self.$('.js_picking_not_found').addClass('hidden');
                    self.$('.js_picking_categories').addClass('hidden');
                }else{
                    self.$('.js_title_label').removeClass('hidden');
                    self.$('.js_picking_categories').removeClass('hidden');
                }
            },100);
        },
        quit: function(){
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'stock_picking_type_action']], ['res_id']).pipe(function(res) {
                    window.location = '/web#action=' + res[0]['res_id'];
                });
        },
        destroy: function(){
            this._super();
            instance.webclient.set_content_full_screen(false);
        },
    });
    openerp.web.client_actions.add('stock.products', 'instance.stock.PickingProductsWidget');





    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


    module.PickingListWidget = module.PageWidget.extend({
        init: function(parent, params){
            this._super(parent,params);
            var self = this;
            init_hash = $.bbq.getState();
            this.picking_type_code = init_hash.type ? init_hash.type:'incoming';

            this.pickings = [];
            this.picking_type_ids = [];
            this.pickings_by_id = {};
            this.pickings_search_string = "";
            this.loaded = this.load();
        },
        load: function(){
            var self = this;

            return new instance.web.Model("stock.picking.type")
                .query(['id'])
                .filter([['code', '=', self.picking_type_code],['active', '=', true]])
                .all()
                .then(function(picking_types) {
                    self.picking_type_ids = [];
                    for(var i = 0; i < picking_types.length; i++){
                        self.picking_type_ids.push(picking_types[i].id);
                    }
                    return new instance.web.Model("stock.picking")
                        .query(['id','name','date','partner_id','state','origin','min_date'])
                        .filter([['picking_type_id', 'in', self.picking_type_ids],['state', 'in', ['assigned','partially_available']]])
                        .order_by('date')
                        .all()
                }).then(function(picks) {
                    self.pickings = [];
                    picks.sort(function(a, b) {if(a.partner_id[1] == b.partner_id[1]){return a.date.localeCompare(b.date);} return a.partner_id[1].localeCompare(b.partner_id[1]);})

                    var picking_states = {  draft:"Draft",
                                            cancel:"Cancelled",
                                            waiting:"Waiting Another Operation",
                                            partially_available: "Partially Available",
                                            confirmed:"Waiting Availability",
                                            assigned:"Ready to Transfer",
                                            done:"Transferred"
                                         }

                    for(var i = 0; i < picks.length; i++){
                        var picking = picks[i];

                        if(picking_states.hasOwnProperty(picking.state)){
                            picking.state = picking_states[picking.state];
                        }

                        picking.partner = picking.partner_id ? picking.partner_id[1] : '';
                        self.pickings_by_id[picking.id] = picking;
                        self.pickings_search_string += '' + picking.id + ':' + (picking.partner ? picking.partner.toUpperCase(): '')
                                                                            + (picking.origin ? picking.origin.toUpperCase(): '')
                                                                            + (picking.name ? picking.name.toUpperCase(): '')
                                                                            + '\n';
                        self.pickings.push(picking)
                    }
                });
        },
        start_rendering: function(){
            var self = this;
            this.$('.oe_searchbox').keyup(function(event){
                self.on_searchbox($(this).val());
            });
            this.$('#product_search_box').focus();
            self.$('.js_clear_search').click(function(){ self.$('#product_search_box').val(""); self.on_searchbox(""); self.$('#product_search_box').focus();});
            self.$('.content').html(QWeb.render('PickingListWidget',{pickings:self.pickings, type:self.picking_type_code.charAt(0).toUpperCase() + self.picking_type_code.slice(1).toLowerCase()}));
            self.$('.js_products_table_todo .oe_product').click(function(){
                self.change = true;
                self.goto_picking($(this).data('id'));
            });
        },
        start: function(){
            this._super()
            var self = this;

            if(self.picking_type_code=='incoming'){
                this.refresh_nav_clicked_btn(".js_pick_incomings");
            }
            else if(self.picking_type_code=='outgoing'){
                this.refresh_nav_clicked_btn(".js_pick_outgoings");
            }

            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
               self.start_rendering();
            });
        },
        goto_picking: function(picking_id){
            $.bbq.pushState('#action=stock.ui&picking_id='+picking_id);
            $(window).trigger('hashchange');
        },
        search_products: function(barcode){
            if ((_.isString(barcode) && barcode.length == 0) || (!barcode)){
                return this.pickings;
            }
            try {
                var re = RegExp("([0-9]+):.*?"+barcode.toUpperCase(),"gi");
            }
            catch(e) {
                //avoid crash if a not supported char is given (like '\' or ')')
	        return [];
            }

            var results = [];
            for(var i = 0; i < 100; i++){
                r = re.exec(this.pickings_search_string);
                if(r){
                    var picking = this.pickings_by_id[Number(r[1])];
                    if(picking){
                        results.push(picking);
                    }
                }else{
                    break;
                }
            }
            return results;
        },
        on_searchbox: function(query){
            var self = this;

            clearTimeout(this.searchbox_timeout);
            this.searchbox_timout = setTimeout(function(){
                self.$('.content').html(
                        QWeb.render('PickingListWidget',{pickings:self.search_products(query), type:self.picking_type_code.charAt(0).toUpperCase() + self.picking_type_code.slice(1).toLowerCase()})
                    );
                self.$('.js_products_table_todo .oe_product').click(function(){
                    self.change = true;
                    self.goto_picking($(this).data('id'));
                });
                if(query){
                    self.$('.js_picking_not_found').addClass('hidden');
                    self.$('.js_picking_categories').addClass('hidden');
                }else{
                    self.$('.js_title_label').removeClass('hidden');
                    self.$('.js_picking_categories').removeClass('hidden');
                }
            },100);
        },
        quit: function(){
            return new instance.web.Model("ir.model.data").get_func("search_read")([['name', '=', 'stock_picking_type_action']], ['res_id']).pipe(function(res) {
                    window.location = '/web#action=' + res[0]['res_id'];
                });
        },
        destroy: function(){
            this._super();
            instance.webclient.set_content_full_screen(false);
        },
    });
    openerp.web.client_actions.add('stock.pickinglist', 'instance.stock.PickingListWidget');


    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


    module.PickingProductWidget = module.PageWidget.extend({
        init: function(parent,params){
            this._super(parent,params);
            var self = this;
            init_hash = $.bbq.getState();
            this.product_id = init_hash.product_id ? init_hash.product_id:0;
            this.product = null;
            this.product_template = null;
            this.stock_moves = [];
            this.picking_ids = [];
            this.picking_ids_move_qty = {};
            this.pickings = [];
            this.picking_type_ids = [];
            this.picking_types = [];
            this.pickings_per_types = [];
            this.loaded = this.load(this.product_id);
        },

        load: function(product_id){
            var self = this;
            if(product_id){
                return new instance.web.Model("product.product")
                    .query(['id','name','barcode','default_code','product_tmpl_id'])
                    .filter([['id', '=', product_id]])
                    .first()
                .then(function(prod) {
                    self.product = prod;
                    self.product.barcode = self.product.barcode ? self.product.barcode : "";
                    return new instance.web.Model("product.template")
                        .query(['id','product_brand_id','qty_available','image_medium','categ_id'])
                        .filter([['id', '=', self.product.product_tmpl_id[0]]])
                        .first()
                }).then(function(product_tmpl) {
                    self.product_template = product_tmpl;
                    self.product.brand = self.product_template.product_brand_id[1] ? self.product_template.product_brand_id[1] : "";
                    self.product.qty_available = self.product_template.qty_available ? self.product_template.qty_available : "";
                    self.product.image_medium = self.product_template.image_medium;
                    self.product.category = self.product_template.categ_id[1];
                    return new instance.web.Model("stock.move")
                        .query(['id','picking_id','product_uom_qty'])
                        .filter([['product_id', '=', self.product.id]])
                        .all()
                }).then(function(stock_mov) {
                    self.stock_moves = stock_mov;
                    self.picking_ids = [];
                    self.picking_ids_move_qty = {};
                    for(var i = 0; i < stock_mov.length; i++){
                        self.picking_ids.push(stock_mov[i].picking_id[0]);
                        self.picking_ids_move_qty[stock_mov[i].picking_id[0]] = stock_mov[i].product_uom_qty;
                    }
                    return new instance.web.Model("stock.picking")
                        .query(['id','name','date','partner_id','state','picking_type_id','product_qty'])
                        .filter([['id', 'in', self.picking_ids]])
                        .all()
                }).then(function(picks) {
                    self.pickings = picks;
                    self.picking_type_ids = [];
                    for(var i = 0; i < picks.length; i++){
                        self.picking_type_ids.push(picks[i].picking_type_id[0]);
                    }
                    return new instance.web.Model("stock.picking.type")
                        .query(['id','code'])
                        .filter([['id', 'in', self.picking_type_ids]])
                        .all()
                }).then(function(pick_types) {
                    self.picking_types = pick_types;
                }).then(function() {
                    self.pickings_per_types = [];
                    var picking_states = {  draft:"Draft",
                                            cancel:"Cancelled",
                                            waiting:"Waiting Another Operation",
                                            partially_available: "Partially Available",
                                            confirmed:"Waiting Availability",
                                            assigned:"Ready to Transfer",
                                            done:"Transferred"
                                          };
                    for(var i = 0; i < self.picking_types.length; i++){
                        var type = {};
                        type.name = self.picking_types[i].code.toUpperCase();
                        type.pickings = [];

                        for(var j = 0; j < self.pickings.length; j++){
                            if(self.pickings[j].picking_type_id[0]==self.picking_types[i].id){
                                if(picking_states.hasOwnProperty(self.pickings[j].state)){
                                    self.pickings[j].state = picking_states[self.pickings[j].state];
                                }
                                self.pickings[j].partner = self.pickings[j].partner_id[1];
                                self.pickings[j].product_qty = self.picking_ids_move_qty[self.pickings[j].id];
                                type.pickings.push(self.pickings[j]);
                            }
                        }
                        type.pickings.sort(function(a, b) {return b.date.localeCompare(a.date);});
                        self.pickings_per_types.push(type);
                    }
                });
            }else{
                return []
            }

        },
        start: function(){
            this._super();
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
               self.$('.content').html(QWeb.render('PickingProductWidget',{product:self.product, pickings_per_types: self.pickings_per_types}));
               self.$('#product_search_box').hide();
               self.$('.js_clear_search').hide();
               self.$('.oe_picking').click(function(){
                   self.goto_picking($(this).data('id'));
               });
            });
        },
        goto_picking: function(picking_id){
            $.bbq.pushState('#action=stock.ui&picking_id='+picking_id);
            $(window).trigger('hashchange');
        },
    });
    openerp.web.client_actions.add('stock.product', 'instance.stock.PickingProductWidget');



    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    module.PartnerListWidget = module.PageWidget.extend({
        init: function(parent, params){
            this._super(parent,params);
            init_hash = $.bbq.getState();
            this.partner_type = init_hash.type ? String(init_hash.type): 'noType';

            this.partners = [];
            this.partners_by_id = {};
            this.partner_search_string = "";
            this.loaded = this.load();
        },
        load: function(){
            var self = this;
            return new instance.web.Model("stock.picking")
                .query(['id','partner_id'])
                .filter([['state', 'in', ['assigned','partially_available']]])
                .order_by('date')
                .all()
                .then(function(pickings) {
                    var partners_ids = [];
                    for(var i = 0; i < pickings.length; i++){
                        var picking = pickings[i];
                        if(!(picking.partner_id[0] in self.partners_by_id)){
                            self.partners_by_id[picking.partner_id[0]] = {id:picking.partner_id[0], name:picking.partner_id[1]};
                            partners_ids.push(picking.partner_id[0]);
                        }
                    }

                    conditions = []
                    conditions.push(['id', 'in', partners_ids])
                    if (['customer','supplier'].indexOf(self.partner_type)!=-1){
                        conditions.push([self.partner_type,'=',true]);
                    }

                    return new instance.web.Model("res.partner")
                        .query(['id','name','street','zip','city','phone','parent_id'])
                        .filter(conditions)
                        .all()
                }).then(function(ptrs) {
                    self.partners = ptrs
                    self.partners.sort(function(a, b) {
                        var x,y;
                        x=a.name;
                        y=b.name;
                        if(a.parent_id){x=a.parent_id[1]}
                        if(b.parent_id){y=b.parent_id[1]}
                        return x.localeCompare(y);
                    })
                    for(var i = 0; i < self.partners.length; i++){
                        var partner = self.partners[i];
                        self.partner_search_string += '' + partner.id + ':' + (partner.name ? partner.name.toUpperCase(): '')
                                                                            + '\n';
                    }
                });
        },
        start_rendering: function(){
            var self = this;

            self.$('.oe_searchbox').keyup(function(event){
                self.on_searchbox($(this).val());
            });
            self.$('#product_search_box').focus();
            self.$('.js_clear_search').click(function(){ self.$('#product_search_box').val(""); self.on_searchbox(""); self.$('#product_search_box').focus();});

            self.$('.content').html(QWeb.render('PartnerListWidget',{partners:self.partners, type: self.partner_type}));
            self.$('.js_products_table_todo .oe_product').click(function(){
                self.change = true;
                self.goto_partner($(this).data('id'));
            });
        },
        start: function(){
            this._super();
            var self = this;

            if(self.partner_type=='customer'){
                this.refresh_nav_clicked_btn(".js_pick_customers");
            }
            else if(self.partner_type=='supplier'){
                this.refresh_nav_clicked_btn(".js_pick_suppliers");
            }

            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
               self.start_rendering();
            });

        },
        goto_partner: function(id){
            $.bbq.pushState('#action=stock.partnerMoves&partner_id='+id);
            $(window).trigger('hashchange');
        },
        search_partners: function(barcode){
            if ((_.isString(barcode) && barcode.length == 0) || (!barcode)){
                return this.partners;
            }
            try {
                var re = RegExp("([0-9]+):.*?"+barcode.toUpperCase(),"gi");
            }
            catch(e) {
                //avoid crash if a not supported char is given (like '\' or ')')
	        return [];
            }

            var results = [];
            for(var i = 0; i < 100; i++){
                r = re.exec(this.partner_search_string);
                if(r){
                    var partner = this.partners_by_id[Number(r[1])];
                    if(partner){
                        results.push(partner);
                    }
                }else{
                    break;
                }
            }
            return results;
        },
        on_searchbox: function(query){
            var self = this;

            clearTimeout(this.searchbox_timeout);
            this.searchbox_timout = setTimeout(function(){
                self.$('.content').html(
                        QWeb.render('PartnerListWidget',{partners:self.search_partners(query), type: self.partner_type})
                    );
                self.$('.js_products_table_todo .oe_product').click(function(){
                    self.change = true;
                    self.goto_partner($(this).data('id'));
                });
                if(query){
                    self.$('.js_picking_not_found').addClass('hidden');
                    self.$('.js_picking_categories').addClass('hidden');
                }else{
                    self.$('.js_title_label').removeClass('hidden');
                    self.$('.js_picking_categories').removeClass('hidden');
                }
            },100);
        },
    });
    openerp.web.client_actions.add('stock.partnerList', 'instance.stock.PartnerListWidget');

    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    module.PartnerMovesWidget = module.PageWidget.extend({
        init: function(parent,params){
            this._super(parent,params);
            init_hash = $.bbq.getState();
            this.partner_id = init_hash.partner_id ? init_hash.partner_id:0;
            this.stock_moves = [];
            this.picking_ids = [];
            this.picking_ids_dict = {};
            this.partner = null;
            this.loaded = this.load(this.partner_id);
        },

        load: function(partner_id){
            var self = this;

            return new instance.web.Model("stock.picking")
                .query(['id','state','name'])
                .filter([['state', 'in', ['assigned','partially_available']],['partner_id','=',parseInt(partner_id)]])
                .order_by('date')
                .all()
                .then(function(pickings) {
                    var picking_states = {  draft:"Draft",
                                cancel:"Cancelled",
                                waiting:"Waiting Another Operation",
                                partially_available: "Partially Available",
                                confirmed:"Waiting Availability",
                                assigned:"Ready to Transfer",
                                done:"Transferred"
                             };
                    for(var i = 0; i < pickings.length; i++){
                        self.picking_ids.push(pickings[i].id)
                        var state = pickings[i].state
                        state = picking_states.hasOwnProperty(state) ? picking_states[state] : ""
                        self.picking_ids_dict[pickings[i].id] = {'state': state, 'id': pickings[i].id, 'name': pickings[i].name}
                    }

                    return new instance.web.Model("stock.move")
                        .query(['id','product_qty','product_uom','product_id','picking_id','state'])
                        .filter([['picking_id', 'in', self.picking_ids]])
                        .order_by('date')
                        .all()
                }).then(function(moves) {
                     self.stock_moves = moves
                     var move_states = {draft:"New",
                                        cancel:"Cancelled",
                                        waiting:"Waiting Another Move",
                                        confirmed:"Waiting Availability",
                                        assigned:"Available",
                                        done:"Done"};

                     for(var i = 0; i < self.stock_moves.length; i++){
                        var move = self.stock_moves[i]
                        var state = move.state
                        move.state = move_states.hasOwnProperty(state) ? move_states[state] : ""
                        move.picking_id = self.picking_ids_dict[move.picking_id[0]]
                     }

                     return new instance.web.Model("res.partner")
                        .query(['id','name','street','zip','city','phone'])
                        .filter([['id', '=', partner_id]])
                        .first()
                }).then(function(ptr) {
                    self.partner = ptr;
                });
        },
        start: function(){
            this._super();
            var self = this;
            instance.webclient.set_content_full_screen(true);
            this.loaded.then(function(){
               self.$('.content').html(QWeb.render('PartnerMovesWidget',{partner:self.partner, stock_moves: self.stock_moves}));
               self.$('#product_search_box').hide();
               self.$('.js_clear_search').hide();
               self.$('.oe_picking').click(function(){
                   self.goto_picking($(this).data('id'));
               });
            });

        },
        goto_picking: function(picking_id){
            $.bbq.pushState('#action=stock.ui&picking_id='+picking_id);
            $(window).trigger('hashchange');
        },
    });
    openerp.web.client_actions.add('stock.partnerMoves', 'instance.stock.PartnerMovesWidget');





    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    module.IncomingProductWidget = module.PageWidget.extend({
        init: function(parent,params){
            this._super(parent,params);
            this.product = null;
            this.barcode="";
            this.productSearchResults = [];
            this.product_tmp = null;
            this.product_template = null;
            this.product_qty = 0;
            this.picking_ids = {};
            this.pickings = [];
            this.picking_type_ids = [];
            this.stock_picking_type = "";
            this.incomings_transferred = [];
            this.incomings_product_qty_sum = 0;
            this.barcode_scanner = new module.BarcodeScanner();
            toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": false,
              "progressBar": true,
              "positionClass": "toast-top-right",
              "preventDuplicates": true,
              "onclick": null,
              "showDuration": "1000",
              "hideDuration": "1000",
              "timeOut": "2000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
        },


        searchProducts: function(searchString){
            var self = this;

            product_templates = {};
            picking_ids = [];
            product_ids = [];

            return new instance.web.Model("product.template")
                    .query(['id','product_brand_id'])
                    .filter([['type', '=', 'product']])
                    .all()
                    .then(function(product_tmpls) {
                        for(var i = 0; i < product_tmpls.length; i++){
                            var product_template = product_tmpls[i];
                            product_templates[product_template.id] = product_template.product_brand_id[1];
                        }
                        return new instance.web.Model("stock.picking")
                            .query(['id'])
                            .filter([['state', 'in', ['assigned','partially_available']]])
                            .all()
                    }).then(function(pickings) {
                        for(var i = 0; i < pickings.length; i++){
                            picking_ids.push(pickings[i].id)
                        }
                        return new instance.web.Model("stock.move")
                            .query(['product_id'])
                            .filter([['picking_id', 'in', picking_ids]])
                            .all()
                    }).then(function(moves) {
                        for(var i = 0; i < moves.length; i++){
                            if(!(moves[i].product_id[0] in product_ids)){
                                product_ids.push(moves[i].product_id[0])
                            }
                        }
                        return new instance.web.Model("product.product")
                            .query(['id','name','barcode','default_code','product_tmpl_id'])
                            .filter(['&',['id', 'in', product_ids],'|',['name','ilike',searchString],['default_code','ilike',searchString]])
                            .limit(15)
                            .order_by('name')
                            .all()
                    }).then(function(prods) {
                        self.productSearchResults = [];
                        for(var i = 0; i < prods.length; i++){
                            var product = prods[i];
                            if (!product_templates[product.product_tmpl_id[0]]){continue;}
                            product.barcode = product.barcode ? product.barcode : ""
                            product.brand = product.product_tmpl_id[0] ? product_templates[product.product_tmpl_id[0]] : "";
                            product.label = product.brand + " - " + product.name + "[" + product.default_code + "]";
                            self.productSearchResults.push(product);
                        }
                        self.productSearchResults.sort(function(a, b) {
                            return a.label.localeCompare(b.label);
                        })
                    });
        },
        loadProduct: function(product_filter_argument){
            var self = this;
            return new instance.web.Model("product.product")
                .query(['id','name','barcode','default_code','product_tmpl_id'])
                .filter([product_filter_argument])
                .first()
            .then(function(prod) {
                if(!prod){
                    self.product_tmp = null;
                    return null;
                }
                self.product_tmp = prod;
                self.product_tmp.barcode = self.product_tmp.barcode ? self.product_tmp.barcode : "";
                return new instance.web.Model("product.template")
                    .query(['id','product_brand_id','qty_available','virtual_available','image_medium','categ_id'])
                    .filter([['id', '=', self.product_tmp.product_tmpl_id[0]]])
                    .first()
            }).then(function(product_tmpl) {
                if(!product_tmpl){return;}
                self.product_template = product_tmpl;
                self.product_tmp.brand = self.product_template.product_brand_id ? self.product_template.product_brand_id[1] : "";
                self.product_tmp.qty_available = self.product_template.qty_available ? self.product_template.qty_available : 0;
                self.product_tmp.virtual_available = self.product_template.virtual_available ? self.product_template.virtual_available : 0;
                self.product_tmp.image_medium = self.product_template.image_medium;
                self.product_tmp.category = self.product_template.categ_id[1];
                return self.product_tmp;
            });

        },
        loadPickings: function(){
            var self = this;
            return new instance.web.Model("stock.move")
                .query(['id','picking_id','product_qty','reserved_availability'])
                .filter([['product_id', '=', self.product.id],['state','!=','done']])
                .all()
                .then(function(pck_ids) {
                    self.picking_ids = {};
                    for(var i = 0; i < pck_ids.length; i++){
                        self.picking_ids[pck_ids[i].picking_id[0]]={'product_qty':pck_ids[i].product_qty, 'stock_move_id':pck_ids[i].id, 'reserved_availability':pck_ids[i].reserved_availability};
                    }
                    return new instance.web.Model("stock.picking.type")
                    .query(['id'])
                    .filter([['code', '=', self.stock_picking_type],['active', '=', true]])
                    .all()
                }).then(function(picking_types) {
                    self.picking_type_ids = [];
                    for(var i = 0; i < picking_types.length; i++){
                        self.picking_type_ids.push(picking_types[i].id);
                    }
                    return new instance.web.Model("stock.picking")
                    .query(['id','name','date','partner_id','state','origin','min_date'])
                    .filter([['picking_type_id', 'in', self.picking_type_ids],['id', 'in', Object.keys(self.picking_ids)],['state', 'in', ['confirmed','assigned','partially_available']]])
                    .all()
                }).then(function(picks) {
                    self.pickings = [];
                    picks.sort(function(a, b) {return a.min_date.localeCompare(b.min_date);});
//old sort method:  picks.sort(function(a, b) {if(a.partner_id[1] == b.partner_id[1]){return a.min_date.localeCompare(b.min_date);} return a.partner_id[1].localeCompare(b.partner_id[1]);})

                    var picking_states = {  draft:"Draft",
                                            cancel:"Cancelled",
                                            waiting:"Waiting Another Operation",
                                            partially_available: "Partially Available",
                                            confirmed:"Waiting Availability",
                                            assigned:"Ready to Transfer",
                                            done:"Transferred"
                                         }

                    for(var i = 0; i < picks.length; i++){
                        var picking = picks[i];

                        if(picking_states.hasOwnProperty(picking.state)){
                            picking.state = picking_states[picking.state];
                        }

                        picking.product_qty = self.picking_ids.hasOwnProperty(picking.id) ? self.picking_ids[picking.id].product_qty : 0;
                        picking.stock_move_id = self.picking_ids.hasOwnProperty(picking.id) ? self.picking_ids[picking.id].stock_move_id : 0;
                        picking.reserved_availability = self.picking_ids.hasOwnProperty(picking.id) ? self.picking_ids[picking.id].reserved_availability : 0;
                        picking.product_qty_diff = picking.product_qty-picking.reserved_availability;


                        picking.partner = picking.partner_id ? picking.partner_id[1] : '';
                        if(picking.product_qty_diff>0){
                            self.pickings.push(picking)
                        }
                    }
                    return self.pickings;
                });
        },
        start: function(){
            this._super();
            var self = this;

            this.refresh_nav_clicked_btn(".js_pick_incoming_product");

            self.render_product_selection();
        },
        render_product_selection: function(){
            var self = this;

            self.$('#product_search_box').unbind();

            self.barcode_scanner.disconnect();
            self.barcode_scanner.connect(function(barcode){
                self.scan(['barcode', '=', barcode]);
            });
            self.$("#product_search_box").autocomplete({
                source: function(request, response) {
                    self.searchProducts(request.term).then(function(){
                        response(self.productSearchResults);
                    })
                },
                minLength: 1,
                select: function( event, ui ) {
                    if(ui.item.barcode.length<1){
                        alert("No barcode found for this product! Please add the barcode in the Odoo web interface");
                    }
                    self.scan(['id', '=', ui.item.id]);
                }
            });

            self.$('.content').html(QWeb.render('IncomingProductWidget',{product:self.product}));

            self.$('#product_search_box').show();
            self.$('.js_clear_search').show();

            self.$('.js_clear_search').click(function(){
                self.$('#product_search_box').val(""); self.$('#product_search_box').focus();
            });

            self.$('#product_search_box').keyup(function(event){
                var val = $(this).val();
                if (val.length == 12 || val.length == 13){
                    self.scan(['barcode', '=', $(this).val()]);
                }
            });


            self.$('.js_minus').unbind();
            self.$('.js_minus').click(function(){
                if (parseInt(self.$('.js_qty').val()) > 0 ){
                    self.$('.js_qty').val(parseInt(self.$('.js_qty').val())-1);
                    toastr.success('-1');
                }
            });
            self.$('.js_plus').unbind();
            self.$('.js_plus').click(function(){
                self.$('.js_qty').val(parseInt(self.$('.js_qty').val())+1);
                toastr.success('+1');
            });

            self.$('.js_confirm_product').unbind();

            self.$('.js_confirm_product').click(function(){
                self.render_incoming_selection();
            });

            //edit barcode

              self.barcode = $( "#barcode" )


            function editEan13() {
              if ( self.barcode.val().length == 13  || true ) {
                return new instance.web.Model("product.product").call('write',[[self.product.id],{'barcode': self.barcode.val() }]).then(function(){
                    self.product.barcode = self.barcode.val();
                    self.$('.content').html(QWeb.render('IncomingProductWidget',{product:self.product}));
                    dialog.dialog( "close" );
                    self.render_product_selection();
                });

              }
              else{
                  alert("Invalid EAN13")
              }
              return true;
            }

            dialog = $( "#dialog-form" ).dialog({
              autoOpen: false,
              height: 200,
              width: 350,
              modal: true,
              buttons: {
                "Save": editEan13,
                Cancel: function() {
                  dialog.dialog( "close" );
                }
              },
              close: function() {
                form[ 0 ].reset();
              }
            });

            form = dialog.find( "form" ).on( "submit", function( event ) {
              event.preventDefault();
              editEan13();
            });

            $( "#edit-barcode" ).button().on( "click", function() {
              dialog.dialog( "open" );
            });


        },
        render_incoming_selection: function(){
            var self = this;
            var qty = parseInt(self.$('.js_qty').val());
            self.product_qty = qty;
            if(self.product != null && qty>0)
            {
                self.$('#product_search_box').hide();
                self.$('.js_clear_search').hide();
                self.$('#product_search_box').unbind();
                self.stock_picking_type = 'incoming';
                self.loadPickings().then(function(){
                    self.barcode_scanner.disconnect();
                    self.$('.content').html(QWeb.render('IncomingProductSelectIncomingsWidget',{product: self.product, incomings:self.pickings}));
                    self.$('.js_minus').unbind();
                    self.$('.js_plus').unbind();
                    self.$('.js_confirm_product').unbind();
                    self.$('.js_qty').unbind();

                    function recompute_product_quantity() {
                        var qty_sum = 0;
                        self.$(".js_qty").each(function() {
                            qty_sum += parseInt($(this).val());
                        });
                        var diff = self.product_qty - qty_sum;
                        self.$('#product_qty').html(diff);
                        if (diff==0){
                            self.$('#product_qty').attr('class','quantity_ok');
                        }
                        else{
                            self.$('#product_qty').attr('class','quantity_nok');
                        }
                        return diff;
                    }

                    self.$(".js_qty").each(function() {
                        var max_qty_move = parseInt($(this).parent().parent().parent().prev().html());
                        var max_qty_share = recompute_product_quantity();
                        var diff = max_qty_share-max_qty_move;
                        if(diff>=0){
                            $(this).val(max_qty_move);
                        }
                        else
                        {
                            $(this).val(max_qty_share);
                            return false;
                        }
                    });

                    recompute_product_quantity();

                    self.$('.js_minus').click(function(){
                        if (parseInt($(this).next().children(".js_qty").val()) > 0 ){
                            $(this).next().children(".js_qty").val(parseInt($(this).next().children(".js_qty").val())-1);
                            toastr.success('-1');
                            recompute_product_quantity();
                        }
                    });
                    self.$('.js_plus').click(function(){
                        max_qty = parseInt($(this).parent().parent().prev().html());
                        input_qty = parseInt($(this).prev().children(".js_qty").val());
                        if (input_qty < max_qty){
                            $(this).prev().children(".js_qty").val(parseInt($(this).prev().children(".js_qty").val())+1);
                            toastr.success('+1');
                            recompute_product_quantity();
                        }
                    });

                    self.$('.js_qty').change(function(){
                        recompute_product_quantity();
                    });

                    self.$('.js_go_to_outgoings').click(function(){
                        self.$('.js_minus').unbind();
                        self.$('.js_plus').unbind();
                        self.$('.js_go_to_outgoings').unbind();
                        self.$('.js_qty').unbind();
                        self.render_outgoing_selection();
                    });


                    self.$('.js_confirm_incomings').click(function(){
                        var qty = recompute_product_quantity();
                        if(qty==0)
                        {

                            //if (confirm('Do you want to continue?')) {
                                var picking_model = new instance.web.Model('stock.picking');
                                var wait_return = function(){};
                                self.incomings_transferred = [];
                                self.incomings_product_qty_sum = 0;
                                self.$(".js_qty").each(function() {
                                    var product_qty = parseInt($(this).val());
                                    if(product_qty > 0){
                                        var picking_id = parseInt($(this).attr('picking-id'));
                                        var stock_move_id = self.picking_ids.hasOwnProperty(picking_id) ? self.picking_ids[picking_id].stock_move_id : 0;
                                        var incoming_transferred = [picking_id, stock_move_id,product_qty];
                                        self.incomings_product_qty_sum += product_qty;
                                        self.incomings_transferred.push(incoming_transferred);
                                        wait_return = picking_model.call('transfer_stock_move_of_a_picking', incoming_transferred).then(function(){
                                            if($("#create-backorder").is(':checked')){
                                                return picking_model.call('create_backorder', [picking_id]).then(function(){
                                                        toastr.success('Backorder created!');
                                                        return true;
                                                    });
                                            }
                                            else{return true;}
                                        });
                                    }
                                });

                                wait_return.then(function(){
                                    self.$('.js_minus').unbind();
                                    self.$('.js_plus').unbind();
                                    self.$('.js_confirm_incomings').unbind();
                                    self.$('.js_qty').unbind();
                                    self.render_outgoing_selection();
                                });

                            /*} else
                            {
                                // Do nothing!
                            }*/
                        }
                        else
                        {
                            toastr.error('The quantity must be equal 0');
                        }
                    });
                });
            }
            else
            {
                toastr.warning('Product quantity must be greater than 0');
            }
        },
        render_outgoing_selection:function(){
            var self = this;

            self.loadProduct(['barcode', '=', self.product.barcode]).then(function(){self.stock_picking_type = 'outgoing'; return self.loadPickings()}).then(function(){
                self.$('.content').html(QWeb.render('IncomingProductSelectOutgoingsWidget',{product: self.product, outgoings: self.pickings, incomings_product_qty_sum: self.incomings_product_qty_sum,}));

                function recompute_product_quantity() {
                    var qty_sum = 0;
                    self.$(".js_qty").each(function() {
                        qty_sum += parseInt($(this).val());
                    });

                    var diff = self.product_qty - qty_sum;

                    self.$('#product_qty').html(diff);
                    if (diff==0){
                        self.$('#product_qty').attr('class','quantity_ok');
                    }
                    else{
                        self.$('#product_qty').attr('class','quantity_nok');
                    }
                    return diff;
                }

                self.$(".js_qty").each(function() {
                    var max_qty_move = parseInt($(this).parent().parent().parent().prev().html());
                    var max_qty_share = recompute_product_quantity();
                    var diff = max_qty_share-max_qty_move;
                    if(diff>=0){
                        $(this).val(max_qty_move);
                    }
                    else
                    {
                        $(this).val(max_qty_share);
                        return false;
                    }
                });

                recompute_product_quantity();

                self.$('.js_minus').click(function(){
                    if (parseInt($(this).next().children(".js_qty").val()) > 0 ){
                        $(this).next().children(".js_qty").val(parseInt($(this).next().children(".js_qty").val())-1);
                        toastr.success('-1');
                        recompute_product_quantity();
                    }
                });

                self.$('.js_plus').click(function(){
                    max_qty = parseInt($(this).parent().parent().prev().html());
                    input_qty = parseInt($(this).prev().children(".js_qty").val());
                    if (input_qty < max_qty){
                        $(this).prev().children(".js_qty").val(parseInt($(this).prev().children(".js_qty").val())+1);
                        toastr.success('+1');
                        recompute_product_quantity();
                    }
                });

                self.$('.js_qty').change(function(){
                    recompute_product_quantity();
                });

                self.$('.js_confirm_print').click(function(){
                    if(recompute_product_quantity()==0)
                    {
                            var picking_model = new instance.web.Model('stock.picking');
                            self.$('.customer-moves').find(".js_qty").each(function() {
                                var product_qty = parseInt($(this).val());
                                if(product_qty > 0){
                                    var picking_id = parseInt($(this).attr('picking-id'));
                                    var stock_move_id = self.picking_ids.hasOwnProperty(picking_id) ? self.picking_ids[picking_id].stock_move_id : 0;
                                    picking_model.call('action_assign', [picking_id])
                                        .then(function(){
                                            return new instance.web.Model('stock.move.transient').call('print_labels_from_stock_move_with_custom_qty',[stock_move_id,product_qty])
                                        }).then(function(action){
                                           return self.do_action(action);
                                        });
                                }
                            });

                            self.$('.stock-moves').find(".js_qty").each(function() {
                                var product_qty = parseInt($(this).val());
                                if(product_qty > 0){
                                    for(var i = 0; i < self.incomings_transferred.length; i++){
                                        var incoming = self.incomings_transferred[i];
                                        var stock_move_id = incoming[1];
                                        new instance.web.Model('stock.move.transient').call('print_labels_from_stock_move_with_custom_qty',[stock_move_id,product_qty])
                                        .then(function(action){
                                            return self.do_action(action);
                                        });
                                    }
                                }
                                self.barcode_scanner.disconnect();
                                self.$('.js_minus').unbind();
                                self.$('.js_plus').unbind();
                                self.$('.js_confirm_print').unbind();
                                self.$('.js_qty').unbind();
                                toastr.success('The labels are printing ...');
                                self.product = null;

                                self.render_product_selection();
                           });
                    }
                    else
                    {
                        toastr.error('The quantity must be completely shared (equals 0)');
                    }
                });
            });
        },

        scan: function(product_filter_argument){ //scans a barcode, sends it to the server, then reload the ui
            var self = this;

            if(product_filter_argument[0]=='barcode'){
                //for barcode barcodes with 12 characters
                ean = String(product_filter_argument[2]);
                //is a number and 12 or 13 chars then barcode
                if(!isNaN(ean) && (ean.length==12 || ean.length==13)){
                    if(ean.length<13){
                        for(var i = 0 ; i<13-ean.length ; ++i){
                            ean = "0"+ean;
                        }
                        product_filter_argument[2] = ean;
                    }
                }
            }
            
            return this.loadProduct(product_filter_argument).then(function(){
                if(self.product == null && self.product_tmp!=null){
                    self.product=self.product_tmp;
                    self.render_product_selection();
                }
                else if(self.product_tmp == null){
                    toastr.error('Product not found');
                    self.$('#product_search_box').val(""); self.$('#product_search_box').focus();
                }
                else if(self.product_tmp && self.product && self.product_tmp.id==self.product.id){
                    self.$('.js_qty').val(parseInt(self.$('.js_qty').val())+1);
                    toastr.success('+1');
                }
                else if(self.product_tmp && self.product && self.product_tmp.id!=self.product.id){
                    if (confirm('Do you want to change the current product?')) {
                        self.product = self.product_tmp;
                        self.render_product_selection();
                    } else {
                        // Do nothing!
                    }
                }  
            });
        },
    });
    openerp.web.client_actions.add('stock.incomingProduct', 'instance.stock.IncomingProductWidget');
    
    
    
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    module.CollectAndGoWidget = module.PageWidget.extend({
        init: function(parent,params){
            this._super(parent,params);
            this.customer = null;
            this.customersSearchResults = null;         
        },

        searchCustomers: function(searchString){
            var self = this;
            return new instance.web.Model("res.partner")
                    .query(['id','name','parent_id'])
                    .filter([['name','ilike',searchString],['customer','=',true]])
                    .limit(15)
                    .order_by('name')
                    .all()
                    .then(function(partners) {
                        self.customersSearchResults = [];
                        
                        for(var i = 0; i < partners.length; i++){
                            var partner = partners[i];
                            if (partner.parent_id[1]){
                                partner.label = partner.parent_id[1] + ": " + partner.name;
                            }
                            else{
                                partner.label = partner.name;
                            }
                            self.customersSearchResults.push(partner);
                        }
                        self.customersSearchResults.sort(function(a, b) {
                            return a.label.localeCompare(b.label);
                        })
                    });   
        },       
        
        start: function(){
            this._super();
            var self = this;
            
            this.refresh_nav_clicked_btn(".js_pick_collect_and_go");            
            self.$('#product_search_box').hide();
            self.$('.js_clear_search').hide();
            
            self.render_customer_selection();
        },
        render_customer_selection: function(){
            var self = this;
            
            self.$('.content').html(QWeb.render('CollectAndGoWidget',{}));

            self.$("#customer_search_box").autocomplete({
                source: function(request, response) {
                    self.searchCustomers(request.term).then(function(){
                        response(self.customersSearchResults);
                    })
                },
                minLength: 1,
                select: function( event, ui ) {
                    self.customer = ui.item;
                }
            });

            self.$('.js_transfer_products_and_print_delivery_note').click(function(){
                new instance.web.Model('delivery.note.lines').call('transfer_products_and_create_delivery_note_from_partner_id', [self.customer.id]).then(function(action){
                                           return self.do_action(action);
                                        }); 
            });
            self.$('.js_print_last_delivery_note').click(function(){
                new instance.web.Model('delivery.note.lines').call('print_last_delivery_note_from_partner_id', [self.customer.id]).then(function(action){
                                           return self.do_action(action);
                                        });
            });
            self.$('.js_print_order_form').click(function(){
                new instance.web.Model('delivery.note.lines').call('print_order_form_from_partner_id', [self.customer.id]).then(function(action){
                                           return self.do_action(action);
                                        }); 
            });             
        },
        
    });
    openerp.web.client_actions.add('stock.collectAndGo', 'instance.stock.CollectAndGoWidget');

    
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    
    module.BarcodeScanner = instance.web.Class.extend({
        connect: function(callback){
            var code = "";
            var timeStamp = 0;
            var timeout = null;

            this.handler = function(e){
               /* if(e.which === 13){ //ignore returns
                    return;
                }*/

                if(timeStamp + 50 < new Date().getTime()){
                    code = "";
                }

                timeStamp = new Date().getTime();
                clearTimeout(timeout);

                code += String.fromCharCode(e.which);

                timeout = setTimeout(function(){
                    if(code.length >= 3){
                        callback(code);
                    }
                    code = "";
                },100);
            };

            $('body').on('keypress', this.handler);

        },
        disconnect: function(){
            $('body').off('keypress', this.handler);
        },
    });
}

openerp.stock = function(openerp) {
    openerp.stock = openerp.stock || {};
    openerp_picking_widgets(openerp);
}
