var anims = {
    
    fadeIn : Display.animations.add(" from { opacity : 0; } to { opacity: 1; }"),
    fadeOut : Display.animations.add(" from { opacity : 1; } to { opacity: 0; }"),
    showTools : Display.animations.add(" from { top: 35px; } to { top: 70px;  }"),
    hideTools : Display.animations.add(" from { top: 75px; } to { top: 40px; }"),
};

var MenuIcon = {
    
    extends : "gui/image",
            
    implementation : function(public, protected, private){
        
        public.setSize(40,40);
        public.setCursor("pointer");
        public.onMouseOver(function(){
            public.setBackgroundColor("rgba(0,0,0,0.3)");
        })
        
        public.onMouseOut(function(){
           public.setBackgroundColor(null);
        });
        
    }
    
}

var IncludeBar = {
    
    extends : "gui/container",
    
    implementation : function(public, protected, private){
        
        var brush = New("gui/brush/linearGradient");
        brush.vertical("#909090", "#303030");
        public.setHeight(45);
        public.setBackgroundBrush(brush);
        
        
        public.setOrientation("horizontal");
        public.setPadding({left: 20, right: 10});
        
        protected.text = New("gui/text", { Text : "Novo Item", Height: 45, FontSize: 16, FontWeight: "bold", FontColor :"white"});
        public.add(protected.text);
        
        protected.button = New("gui/text", { Text : "Incluir", FontSize: 14, FontWeight: "bold", FontColor :"#606060", Padding: 8, Align: "center", MarginTop: 4, Width: 120, Cursor :"pointer", BorderRadius: 12, BackgroundColor : "#cccccc", InnerShadow : {left: 0, top: 0, width: 8, color : "rgba(0,0,0,0.8)"}, Float : "right"});
        public.add(protected.button);
        protected.button.onMouseOver(function(){
            protected.button.setBackgroundColor("#e0e0e0");
        });
        protected.button.onMouseOut(function(){
           protected.button.setBackgroundColor("#cccccc"); 
        });
        protected.button.onMouseDown(function(){
           if (protected.oninsert != null) protected.oninsert(); 
        });
        public.setText = function(f){
            if (f == null || f == "") f = "Novo Item";
            protected.text.setText(f);
        }
        
        public.onInsert = function(f){
            protected.oninsert = f;
        }
        
  
    }
    
}

var HeaderField = {
    
    extends : "gui/container",
    
    implementation : function(public, protected, private){
        public.setSize(40);
        public.setPadding( {left : 5, top : 6});
        public.setOrientation("vertical");
        public.setBorderRight({width: 1, color : "#e0e0e0", style : "dashed"});
        
        var title = New("gui/text", {FontSize: 9, FontColor :"909090", Text : "Campo"});
        var value = New("gui/text", {FontSize: 11, Text : "Valor do Campo"});
        protected.title = title;
        protected.value = value;
        
        public.addMultiple([title, value]);       
        public.onMouseOver(function(){
            public.setBackgroundColor("rgba(255,255,255,0.8)");
        })
        
        public.onMouseOut(function(){
            public.setBackgroundColor(null);
        })
        
        public.setTitle = function(t){
            protected.title.setText(t);
        }
        
        public.setValue = function(t){
            protected.value.setText(t);
        }
        
        public.setValueText = function(t){
            protected.value.setText(t);
        }
        
    }
    
}

var Tab = {
    extends : "gui/text",
            
    implementation : function(public, protected, private){
        public.setPadding({left: 8, right : 8});
       // public.setMargin({left: 8, right : 8});
        public.page = "";
        public.setFontColor("#303030");
        public.setFontSize(11);
        

        public.setCursor("pointer");
        protected.selected = false;
        protected.enabled  = true;
 
        public.setTabContainer = function(b) { protected.bookmark = b;}
        
        public.setPage = function(p){
            public.page = p;
        }
        
        public.onMouseOver(function(){
            if (protected.selected == true || protected.enabled == false) return;
           public.setBackgroundColor("rgba(0,0,0,0.1)"); 
        });
        
        public.onMouseDown(function(){
            if (protected.selected == true || protected.enabled == false) return;
            public.setBackgroundColor("rgba(0,0,0,0.2)");
            protected.bookmark.selectTab(public);
        })
        
        public.onMouseOut(function(){
            if (protected.selected == true || protected.enabled == false) return;
            public.setBackgroundColor(null);
        })
        
        public.setSelected= function(b){
            protected.selected = b;
            if (b == true){
               // public.setFontWeight("bold");
                public.setFontColor("white");
                public.setBackgroundColor("rgba(0,0,0,0.4)");
                        
            } else{ 
               // public.setFontWeight(null);
                public.setFontColor("#606060");
                public.setBackgroundColor(null);
            }
        }
        
        public.setEnabled=function(b){
            protected.enabled = b;
            if (b == false)
                public.setOpacity(0.3);
            else public.setOpacity(1);
        }
        

        
    }
    
}

var file = {
    
    extends : "gui/container",
            
    implementation : function(public, protected, private){
        
        var tabContainer = New("gui/container", { RelativeRect : { top: 0, left: 0, right: 0}, Height : 80, BackgroundColor : "#fbfbfb", Orientation: "horizontal" });
        var pageContainer = New("gui/container", { BackgroundColor :"white", RelativeRect : { top: 70, left: 0, right: 0, bottom: 0 }, Shadow : { left: 0, top :0, size : 10, color :"rgba(0,0,0,0.4)" }});
        
        protected.tabContainer = tabContainer;
        protected.fields = New("gui/container", { Height: 40, Orientation: "horizontal", BorderRight: {width: 1, color: "#cccccc"}});
        protected.fileView = null;
        protected.fileHeader  = null;
        protected.contentTop  = 0;
        protected.pageContainer = pageContainer;
        protected.tabs = [];
        protected.toolBarVisible = true;
        //protected.toolBarVisible = false;
        var menuIcon = New(MenuIcon);
        menuIcon.onMouseDown(function(){
            if (protected.toolBarVisible == false){
                protected.toolBarVisible = true;
                anims.showTools.play(protected.pageContainer, 300);
            } else{
               protected.toolBarVisible = false;
                anims.hideTools.play(protected.pageContainer, 300); 
            }
        });
        protected.tabContainer.add(menuIcon);
        protected.tabContainer.add(protected.fields);
        public.setMenuIcon = function(icon){
            menuIcon.setImage("docui_01/menus/"+icon+".png");
        }
        public.addMultiple([tabContainer, pageContainer]);
        
        
        public.addPage = function(title, pg){
            var tab = New(Tab, {Text: title, TabContainer : public, Page : pg, Height: 40});
            protected.tabContainer.add(tab);
            protected.tabs.push(tab);
        }
        
        public.addHeaderField = function(attr){
            var field = New(HeaderField, attr);
            field.setHeight(40);
            protected.fields.add(field);
            return field;
        }
        
        public.setCreateInfo = function(d){
            protected.viewCreating = d.view;
            protected.titleCreating = d.title;            
        }

        
        public.selectTab = function(tab){
            if (protected.curTab != null)
                protected.curTab.setSelected(false);
            
            protected.curTab = tab;
            tab.setSelected(true);
            
            var page = tab.page;
            if (page != null){
                if (page.view == null)
                    page.view = New(page.uri);
            
                public.setFileView(page.view);
            } else {
               public.setFileView(null); 
            }
        }
        
        public.setFileHeader = function(header){
            if (protected.fileHeader != null) 
                protected.pageContainer.remove(protected.fileHeader);
            if (header == null) return;
            protected.contentTop = parseInt(header.getHeight())+1;
            header.setRelativeRect({left: 0, right: 0, top: 0});
            protected.pageContainer.add(header);
            protected.fileHeader = header;
            
        }
        
        public.setFileView = function(view){     
            if (protected.fileView != null){
                
                anims.fadeOut.play(protected.fileView, 300, function(){
                    protected.pageContainer.remove(protected.fileView);
                    
                    protected.fileView = view;
                    if (view == null) return;
                    protected.fileView.setRelativeRect({left: 0, top : protected.contentTop, right: 0, bottom: 0});
                    protected.pageContainer.add(protected.fileView);
                     
                    anims.fadeIn.play(protected.fileView, 300, function(){
                    });
                });
            } else{
                if (view == null) return;
                view.setRelativeRect({left: 0, top : protected.contentTop, right: 0, bottom: 0});
                protected.pageContainer.add(view);
                protected.fileView = view;
                anims.fadeIn.play(protected.fileView, 300);
            }
        }
        
        public.selectFirst = function(){
            if (protected.tabs.length > 0)
                public.selectTab(protected.tabs[0]);
        }
        
        public.onShow = function(){
            public.selectFirst();
        }
        
        public.open = function(f){
            protected.file = f;
            if(protected.includeBar != null){
                public.remove(protected.includeBar);
                protected.includeBar = null;
                protected.pageContainer.setRelativeRect({top: 40});
            }
            if (protected.includeView != null){
                protected.pageContainer.remove(protected.includeView);
                protected.includeView = null;
            }
            if (protected.fileHeader != null) 
                protected.fileHeader.setVisible(true);
            
            if (protected.fileView != null)  protected.fileView.setVisible(true);    
            
            if (public.refreshData != null)
                public.refreshData(f);
            
            if (public.doOpen != null)
                public.doOpen(f);
        }
        
        public.new = function(callback){
            var view  = New(protected.viewCreating);
            
            if (protected.fileView != null)  protected.fileView.setVisible(false);
            if (protected.fileHeader != null) 
                protected.fileHeader.setVisible(false);

            protected.includeView = view;
            protected.includeView.setRelativeRect({left: 0, top : 0, right: 0, bottom: 0});
            protected.pageContainer.add(protected.includeView);
            protected.pageContainer.setRelativeRect({top: 30});
            
            protected.includeBar = New(IncludeBar, {RelativeRect : {left: 0, right: 0, top: 0}, Text : protected.titleCreating});
            public.add(protected.includeBar);
            protected.includeBar.onInsert(function(){
                 public.doInsert(protected.includeView, function(err){
                     if (err == null){
                         if (callback != null) callback(view.getData());
                     }
                 }); 
            })
               
        }
        
        
        //////////////////////////////////////////
        
        protected.toolBar  = New("docui/01/smallToolBar", {RelativeRect: { left: 0, top: 40, right: 0}, Height: 20, BackgroundColor : "#eeeeee", PaddingTop: 5, BorderTop: {width: 1, color :"#cccccc"}});
	protected.tabContainer.add(protected.toolBar);
        protected.toolBar.setPositionMode("absolute");
        
        protected.loader = protected.toolBar.addSimpleButton({MarginLeft: 5, Image : "docui_01/smlst.gif", Float : "left", MarginRight: 5, BorderRight: {width: 1, color : "#909090"}});
 
        protected.toolBar.addSimpleButton({Icon : "export"});
        protected.toolBar.addSimpleButton({Icon : "print"});
        protected.toolBar.addSimpleButton({Icon : "new", Float : "left"});
        protected.toolBar.addSimpleButton({Icon : "remove", Float : "left"});
        
    }
    
}


file;