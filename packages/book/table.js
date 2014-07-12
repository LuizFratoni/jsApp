/*
function MenuController(){
    
    var menu = New("autosig/popupMenu");

    menu.setEnabledButtonBar(false);
    menu.addItem("", "Marcar como Devolução");
    menu.addItem("", "Remover");
    
    this.getMenu = function(){
        return menu;
    }
}*/




var tableCol = {
    extends : "gui/text",
    className : "Document.01.Table.Column",
          
    implementation : function(public, protected, private){
        public.setAlign("center");
        public.setFontSize(11);
        public.setBorderRight({width : 1, color : "#cccccc"});
        public.setHeight(30);
        protected.table = null;
        protected.baseSetWidth = public.setWidth;
        protected.colAlign = 0;
        protected.width = 0;
        protected.dataType = 0;// string
        protected.binding = "";
        

        public.setBinding = function(b){
            if (b.constructor == Array) protected.bindMode = 1;
            else protected.bindMode = 0;
            
            protected.binding = b;
        }
        
        public.setTable = function(tb){
            protected.table = tb;
        }
        
        public.onMouseOver(function(){
            public.setBackgroundColor("rgba(255,255,255,0.3)"); 
        });
        
        public.onMouseOut(function(){
           public.setBackgroundColor(null);
        });
              
        public.onMouseDown(function(){
            protected.table.sortByColumn(public);
        });
        
        public.getTextFrom = function(data){
            if (protected.bindMode == 0){
                return data[protected.binding];
            } else if (protected.bindMode == 1){
                var cur = data;;
                protected.binding.forEach(function(field){
                    cur = cur[field];
                });
                return cur;
            }
        }  //do Data transformation

        public.setWidth = function(w){
            protected.width = w;
            protected.baseSetWidth(w);
        }

        public.getWidth = function(){
            return protected.width;
        }

        public.createCell = function(row){
            var attrs;
            if (protected.cellAttr != null)
                attrs = protected.cellAttr;
            else attrs= {};
            attrs.Column = public;
            attrs.Row = row;
            attrs.Width = protected.width;
            attrs.Height = 30;
            
            if (protected.colAlign == 0){
                attrs.PaddingLeft = 5;
                attrs.Width = protected.width -5;
            }
            else if (protected.colAlign == 1){
                attrs.PaddingRight = 5;
                attrs.Align = "right";
                attrs.Width = protected.width -5;
            }
            var cell;
            if (protected.customClass != null)
                 cell = New(protected.customClass);
            else cell = New(tableCell, attrs);
            return cell;
           //return "TESTE";
        }
        
        public.setCell = function(cell){
            protected.cellAttr = cell;
            var al = cell.Align;
            if (al == "right") protected.colAlign = 1;
            else if (al == "center") protected.colAlign = 2;
            else
            protected.colAlign = 0;
            if (cell.Class != null){
                if (cell.Class.constructor == String)
                    protected.customClass = Class.fromName(cell.Class.constructor);
                else protected.customClass = cell.Class;
            }
        }
                
        public.isLesser = function(a,b){
            var va, vb;
            if (protected.bindMode == 0){ 
                va = a.getData()[protected.binding];
                vb = b.getData()[protected.binding];
            } else {
                var cur = a.getData();
                protected.binding.forEach(function(field){
                    cur = cur[field];
                });
                va = cur;
                
                var cur = b.getData();
                protected.binding.forEach(function(field){
                    cur = cur[field];
                });
                vb = cur;
            }
            
            if (va < vb) return -1;
            if (va > vb) return 1;
            return 0;
        }
    }

}

var tableRow = {
    
    extends : "gui/container",
            
    implementation : function(public, protected, private){
        public.setOrientation("horizontal");
        public.setHeight(30);
        protected.alternated = false;
        public.setBorderBottom({color: "#e0e0e0", width: 1});

        protected.cells = [];
        protected.selected = false;
        
        public.setData = function(data){
            protected.data = data;
            protected.data._handler = public;
            for (var i = 0; i < protected.cells.length; i++){
                protected.cells[i].bindFrom(data);
            }
        }
        
        public.setTable = function(tb){
            protected.table = tb;

           
           for(var c = 0 ; c < protected.table.getColumnCount(); c++){
                var cell = protected.table.getColumn(c).createCell(public);
                protected.cells.push(cell);
                public.add(cell);
            }
        }
        

        
        public.setAlternated = function(b){
            protected.alternated = b;
            if (b == true)
                public.setBackgroundColor("#fbfbfb");
            else public.setBackgroundColor("#ffffff");
        }
        
        public.isAlternated = function(){
            return  protected.alternated;
        }

        public.setSelected = function(b){
            protected.selected = b;
            if (b == true){
                public.setBackgroundBrush(protected.table.getSelectedRowBrush());
                public.setBorderBottom( { width : 1, color : "#cccce0"} );
            }
            else {
                public.setBackgroundBrush(null);
                public.setBorderBottom( { width : 1, color : "#e0e0e0"} );
                if (protected.alternated == true)
                    public.setBackgroundColor("#fbfbfb");
                else
                    public.setBackgroundColor("#ffffff");
            }
        }
        
        public.onMouseDown(function(){
            protected.table.selectRow(public);
        });
        
        public.getData = function(){
            return protected.data;
        }
    }
    
}

var tableCell = {
    
    extends : "gui/text",
    
    implementation : function(public, protected, private){
          public.setBorderRight({width: 1, color : "#e0e0e0"}); 
          public.setHeight(30);
          public.setFontSize(11);
          public.setColumn = function(col){
              protected.col = col;
          }  
          
          public.setRow = function(row){
              protected.row = row;
          }
          
          public.bindFrom = function(data){
              public.setText( protected.col.getTextFrom(data) );                
          }
    }   
    
}

/////

Class.register("book/table/row", tableRow);
Class.register("book/table/column", tableCol);
Class.register("book/table/cell", tableCell);

////

var Table = {
    
    extends : "gui/container",
            
    implementation : function(public, protected, private){
        public.setBackgroundColor("#f9f9f9");
        var header_brush = New("gui/brush/linearGradient");
        header_brush.vertical("#cccccc", "#eeeeee");
        protected.minWidth = 0;
        var headerHost = New("gui/container", { RelativeRect : { left: 0, top: 0, right: 0}, Height: 30, Orientation: "vertical", BackgroundBrush : header_brush});
        var gridHost   = New("gui/container", { RelativeRect: { left: 0, top: 30, bottom: 20, right: 0} });
        var grid       = New("gui/container", { Orientation : "vertical", MarginTop:0, RelativeRect :{ left: 0, right: 0}, Shadow : {left:0, top: 0, size: 4, color : "rgba(0,0,0,0.5)"}});
        
        protected.nextRowAlternated = true;
        protected.cols = [];
        protected.rows = [];
        protected.footers = [];
        protected.footerOffset = 0;
        
        
        var header     = New("gui/container", { Orientation: "horizontal", Height: 30});
        
        gridHost.enableScroll(true);
        gridHost.getDOMElement().style.width = "100%";
        //////////////////////////////////////////////////////
        var brush = New("gui/brush/linearGradient");
        brush.vertical("#606060", "#d0d0d0");
        
        var br2 = New("gui/brush/linearGradient");
        br2.vertical("#eecccccc", "ffeeeeee");
        
        
        headerHost.add(header);
        gridHost.add(grid);
        protected.grid = grid; 
        protected.gridHost = gridHost;
        protected.headerHost = headerHost;
        protected.header = header;
        protected.headerHost.setBorderBottom({width: 1, color :"#cccccc"});
      //  protected.headerHost.setShadow({left:0, top: 2, size: 4, color : "#cccccc"});
      //  protected.headerHost.setInnerShadow({left:0, top: 5, size: 8, color : "#aaaaaa"});
        protected.gridHost.onScroll(function(e, top, left){
            protected.headerHost.getDOMElement().scrollLeft = left;
        });

        public.addMultiple([gridHost, headerHost]);
           
            
        //////////////////////////////////////////////////
        
        public.addColumn = function(attr){
            var col = New(tableCol, attr);
            col.setTable(public);
            protected.minWidth += col.getWidth()+1;
            protected.header.add(col);
            protected.cols.push(col);
            protected.header.setMinWidth(protected.minWidth+protected.cols.length+3);
            protected.grid.setMinWidth(protected.minWidth+protected.cols.length+3);
            return col;
        }
        
        public.setColumns = function(cols){
            var col;
            cols.forEach(function(attr){
                col = New(tableCol, attr);
                col.setTable(public);
                protected.cols.push(col);
                protected.minWidth += col.getWidth();
                protected.header.add(col);
            });
            protected.header.setMinWidth(protected.minWidth+5);
            protected.grid.setMinWidth(protected.minWidth+5);
        }
        
        public.bind = function(data){
            protected.grid.clear();
            
            protected.rows = [];
            data.forEach(function(item){
                public.addRow(item);
            });
        }
        
        public.addRow = function(data){
            var row = New(tableRow, {Table : public, RelativeRect: {left: 0, right: 0}});
            row.setData(data);
            protected.rows.push(row);
            protected.grid.add(row);
            row.setAlternated(protected.nextRowAlternated);
            protected.nextRowAlternated = protected.nextRowAlternated == false;
            return row;
            
        }
        
        public.getColumn = function(i){
            return protected.cols[i];
        }
        
        public.getColumnCount = function(){
            return protected.cols.length;
        }
        
        public.sortByColumn = function(col){
            protected.grid.clear();
            try{
                protected.rows.sort(function(a,b){
                    return col.isLesser(a,b);
                });
            } finally {
                    var par = true;
                    protected.rows.forEach(function(row){
                    row.setAlternated(par);
                    par = par == false;
                    protected.grid.add(row); 
            });
            }
        }
        
        ////////////////////////////////////////////////////////////////////
        
        public.getSelectedRowBrush = function(){
            if (protected.selectedRowBrush == null){
                protected.selectedRowBrush = New("gui/brush/linearGradient");
                protected.selectedRowBrush.vertical("#cccce0", "eeeeff");
            }
            return protected.selectedRowBrush;
        }
        
        public.selectRow = function(row){
            if (protected.selectedRow != null){
                protected.selectedRow.setSelected(false);
            }
            protected.selectedRow = row;
            if (row != null) row.setSelected(true);
            if (protected.rowSelectLister != null)
                 protected.rowSelectLister(row);
            if (protected.selectItemListener != null)
                protected.selectItemListener(row.getData());
        }
        
        public.setRowSelectListener = function(f){
            protected.rowSelectLister = f;
        }
        
        public.setSelectItemListener = function(f){
            protected.selectItemListener = f;
        }
        
        public.addFooter = function(view){
            if (view.constructor == String)
                view = New(view);
                        
            view.setRelativeRect({left: 0, bottom: protected.footerOffset, right: 0});
            protected.footerOffset += parseInt(view.getHeight());
            protected.gridHost.setRelativeRect({ bottom : protected.footerOffset+1 });
            public.add(view);
            protected.footers.push(view);
        }
           
        public.selectFirst = function(){
            var row = protected.rows[0];
            if (row != null)
                public.selectRow(row);
        }   
        
       // public.setTools(protected.toolBar);   
        
       // var buttons = protected.toolbar.addDefaultUIButtons();
        //protected.loader = buttons.loader;
        /*
        protected.loader = protected.toolBar.addSimpleButton({Image : "docui_01/smlst.gif", Float : "left", MarginRight: 5, BorderRight: {width: 1, color : "#909090"}});
 
        protected.toolBar.addSimpleButton({Icon : "export"});
        protected.toolBar.addSimpleButton({Icon : "print"});
        protected.toolBar.addSimpleButton({Icon : "new", Float : "left"});
        var remove = protected.toolBar.addSimpleButton({Icon : "remove", Float : "left"});*/
        //protected.toolBar.setUIManager(public);
        
       /* remove.onMouseDown(function(){
            var dlg = New("autosig/dialogs/questionDlg", {Text : "Deseja realmente remover este fornecedor?"});
            public.showDialog(dlg);
            dlg.setListener(function(b){
                if (b == true) alert("VAI REMOVER");
                else alert("Não removido");
            });
        });*/
        
        /*public.setEnabledToolButtons = function(d){
            //protected.toolBar  = New("docui/01/smallToolBar");
            protected.toolbar = New("docui/01/smallToolBar", {UIManager: public});
            var buttons = protected.toolbar.addDefaultUIButtons();
            public.addFooter(protected.toolbar);
            protected.toolbar.setActionListener(function(act, btn){
                if (act == "print") {
                    var printView = New("docui/01/UIPrintView");
                    printView.show(function(doc){
                        public.printTo(doc);
                    });
                } else if (act == "remove"){
                    protected.removeSingleItem();
                } else if (act == "export"){
                    alert("Exportando dados");
                    var doc = New("xls/document");
                    
                } else if (act == "new"){
                    if (protected.createListener != null)
                        protected.createListener(function(data){
                            alert("RETORNOU INFORMAÇÔES");
                        });
                }
            });
            
            if (d == null || d.constructor == null || d.constructor != Object) return;
            
            if (d.remove != null){
                if (d.remove.Text != null)
                    protected.removeSingleItemText = d.remove.Text;
                if (d.remove.uri != null)
                    protected.removeSingleItemUri = d.remove.uri;
                if (d.remove.binding != null)
                    protected.removeItemBinding = d.remove.binding;
            }
            
            if (d.create != null){
                protected.createListener = d.create.listener;
            }
            
        }*/
        
        public.showDialog = function(view){
            view.setUIManager(public);
            view.setRelativeRect({left:0, bottom:  protected.footerOffset+1, right: 0});
            DOCUI_01.anims.fadeIn.play(view,300);
            public.add(view);
        }
        
        public.closeDialog = function(view){
            DOCUI_01.anims.fadeOut.play(view,300, function(){
                public.remove(view);
            });
        }
        
        
        /////////////////////////////////////////
        
        public.printTo = function(doc){
            doc.setFontSize(12);    
            doc.text(20,20, "Teste de Impressão em PDF ");
            
            doc.setProperties({
                title: 'PDF Title',
                subject: 'This is the subject',     
                author: 'Ravishanker Kusuma',
                keywords: 'pdf, javascript,geenerated',
                creator: 'KRS'
            });
        }
        
        protected.removeSingleItem = function(){
                
            var row = protected.selectedRow;
            if (row == null) return;
            row = row.getData();
            if (row == null) return;
            if (protected.removeItemBinding != null )
                row = row[protected.removeItemBinding];
            else row = row.id;
            
             var uibox = New("autosig/dialogs/questionDlg");
             if (protected.removeSingleItemText == null)
                 uibox.setText("Deseja realmente remover este Item?");
             else 
                 uibox.setText(protected.removeSingleItemText);
             
             uibox.setListener(function(b, dlg){
                if (b == true){
                    if (protected.removeSinleItemListener != null){
                        protected.removeSinleItemListener(protected.selectedRow.getData());
                        return;
                    }
                        
                    Autosig.delete(protected.removeSingleItemUri+"/"+row, function(err, result){
                       alert("OK"); 
                    });
                }
                public.closeDialog(dlg); 
             });
             public.showDialog(uibox);
        }
    }
    
}


////
Table;
