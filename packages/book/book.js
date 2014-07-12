
var sectionIcon = {
    
    extends : "gui/text",
    //ue67f
    implementation: function(public, protected, private){
        protected.selected = false;
        public.use({
            FontSize: 24, Text : "\ue67f", FontColor : "white", FontFamily : "autosig",
            Align : "Center", Height: 40, Width: 45, Cursor : "pointer",
            TextShadow : { left: 2, top: 2, size: 4, color : "rgba(0,0,0,0.8)"}
            
        });
        
        public.onMouseOver(function(){
            if (protected.selected == true) return;
            public.setBackgroundColor("rgba(255,255,255,0.5)");
        });
        
        public.onMouseOut(function(){
            if (protected.selected == true) return;
           public.setBackgroundColor(null); 
        });
        
        public.onMouseDown(function(e){
            e.stopImmediatePropagation();
            if (protected.menu != null){
                protected.menu.popup(public);
                return;
            }
            
            if (protected.selectListener != null)
                protected.selectListener(public);
            
        });
        
        ///////////////////////////////////////////////
        
        public.setSelected = function(b){
             protected.selected = b;
             if (protected.selected == true){
                 public.setBackgroundColor("rgba(255,255,255,0.6)");
                 public.setFontColor("#909090");
             } else{
                  public.setBackgroundColor(null);
                  public.setFontColor("white");                 
             }
        }
        
        public.setSelectListener = function(listener){
            protected.selectListener = listener;
        }
        
        public.setIcon = function(txt){
            public.setText(txt);
        }
        
        public.setView = function(vw){
            protected.view = vw;
        }
        public.setViewComplement = function(vw){
            protected.viewComplement = vw;
        }
        
        public.getView = function(vw){
            return protected.view;
        }
        
        public.getViewComplement = function(){
            return protected.viewComplement;
        }
        
        public.setTitle = function(title){
            protected.title = title;
        }
        
        
        public.setCompiledPage = function(pg){
            protected.compiledPage = pg;
        }
        
        public.getCompiledPage= function(){
            return protected.compiledPage;
        }
        
        public.setonPageShow = function(listener){
            public.onPageShow = listener;
        }
        
        public.setonPageCreate = function(listener){
            public.onPageCreate = listener;
        }
        
    }
    
}

var anims = {
        fadeIn : Display.animations.add(" from { opacity : 0} to { opacity: 1} "),
        fadeOut : Display.animations.add(" from { opacity : 1} to { opacity: 0} "),
    };


var book = {
    
    extends : "gui/container",
    
    implementation : function(public, protected, private){
    
        protected.theme = {};
        protected.theme.bgColor = "#707070";
        protected.theme.pageIconColor = "white";
        protected.theme.pageBorder = { color : "#a0a0a0", width : 1 };
        
        protected.selectedSection = null;
        
        protected.sectionsBar = New("gui/container", { RelativeRect: {left: 5, top: 50, bottom: 10},
                                    BackgroundColor : protected.theme.bgColor, Width: 45, Orientation: "horizontal",
                                    Shadow : { left: 2, top: 2, size: 8, color : "rgba(0,0,0,0.7)" }
                                });
                          
        protected.footer = New("gui/container", {Orientation: "vertical", Width: 45, RelativeRect: {left: 0, right: 0, bottom: 10} });

        public.add(protected.sectionsBar);
        protected.sectionsBar.add(protected.footer);
        protected.footer.setPositionMode("absolute");
        
        ////////////////////////////////////////////////
        
        public.addSection = function(section){
            //icon, view (uri or object), title, menu
            //separator : true/false
            if (section.separator == true){
                protected.sectionsBar.add(New("gui/view", {MarginTop: 10, MarginBottom: 10, Height: 1, Width: 45, BackgroundColor : "white"}));
                return;
            }
            
            section.SelectListener = function(s){
                protected.selectSection(s);                   
            }
            
            var sbtn = New(sectionIcon, section);
            if (section.Footer == true)
                protected.footer.add(sbtn);
            else protected.sectionsBar.add(sbtn);   
            return sbtn;
        }
        
        ///////////////////////////////////////////////////////

        protected.menuIcon =  public.addSection({Icon : "\ue67f", View : null}); //New(sectionIcon, );
        protected.menuIcon.use({MarginBottom: 20, MarginTop:10 });
        protected.menuIcon.setVisible(false);
        
        public.setMenu = function(mn){
            protected.menuIcon.use(mn);
            protected.menuIcon.setVisible(true);
        }       
        
        
        /////////////////////////////////////////////////////////
        
        public.setSections = function(secs){
            
            var first = null;
            var aux;
            
            secs.forEach(function(sec){
                if (sec != null){
                    aux = public.addSection(sec); 
                    if (first == null && sec.menu == null) first = aux;
                }
            });
            
            if (first != null){
               protected.selectSection(first);
            }
            
        }
        
        protected.selectSection = function(s){
            if (protected.selectedSection == s) return;
            if (protected.selectedSection != null){
                    protected.selectedSection.setSelected(false);
                    
                    protected.hideCurrentSection(function(){
                        protected.showSection(s);
                    });
                    
                    return;
            }
            
            protected.showSection(s);
            
            
        }
        
        protected.hideCurrentSection = function(callback){
             protected.hidePage(protected.selectedSection.getCompiledPage(), callback);
        }
        
        protected.showSection = function(s){
            protected.selectedSection = s;
            if (s != null)
                s.setSelected(true);   
            
            //////////////////////////
            var compiledPage = s.getCompiledPage();
            if (compiledPage != null){
                protected.showPage(compiledPage);
                return;
            }
            
            var pg = protected.compilePage(protected.selectedSection);
            protected.selectedSection.setCompiledPage(pg);
            if (protected.selectedSection.onPageCreate != null){
                protected.selectedSection.onPageCreate(pg);
            }
            protected.showPage(pg, function(){
                if (protected.selectedSection.onPageShow != null)    
                    protected.selectedSection.onPageShow(pg);
            });            
            
        }
        
        //////////////////////////////////////////////////////////////////////////////////////
        
        protected.compilePage = function(s){
            var compiledPage = {};
            
            var complement  = s.getViewComplement();
            var view = s.getView();
            
            if (view == null) return {};
            if (view.constructor == String){
                view = New(view);
            }
            
            view.use({ RelativeRect : { left: 50, top : 50, right: 10, bottom: 10}, Shadow: {left: 2, top: 2, size: 8, color :"rgba(0,0,0,0.7)"}, Border: protected.theme.pageBorder } );            
            compiledPage.view = view;
               
            if (complement != null){
                compiledPage.complement = New(complement.View, { RelativeRect: {right: 10, top: 50, bottom: 10} });
                var w;
                
                compiledPage.splitter = New("gui/view", { Width: 8, Cursor : "col-resize", RelativeRect : { top: 50, bottom: 10 } } );
                if (complement.Maximized == true){
                    if (complement.Split != null){
                        if (complement.Split > 0 ){
                            w = complement.Split;
                            view.setWidth(w);
                        }
                    } else{
                        w = view.getPreferredWidth();
                        if (w == null) w = view.getWidth();
                        view.setWidth(w);
                        compiledPage.complement.setRelativeRect({left: w+60});
                        compiledPage.splitter.setRelativeRect({left: w+51});
                    }
                    
                    
                } else {
                    w = complement.Width; if (w == null || w ==0 ) w = 200;
                    view.setRelativeRect( { right: w+ 60 });
                    
                }
                
                
                if (complement.Decorated == true)
                    compiledPage.complement.use({Shadow: {left: 2, top: 2, size: 8, color :"rgba(0,0,0,0.7)"}, Border: protected.theme.pageBorder });
            }
            
            return compiledPage;
        }
        
        protected.showPage = function(pg, callback){
            public.add(pg.view);
            if (pg.complement != null){
                public.add(pg.complement);
                public.add(pg.splitter);
                anims.fadeIn.play(pg.complement, 300);
            }
            anims.fadeIn.play(pg.view, 300, callback);
        }
        
        protected.hidePage = function(pg, callback){
            
            if (pg.view == null) { callback(); return;}    
            if (pg.complement != null) anims.fadeOut.play(pg.complement, 200);
            if (pg.view != null) anims.fadeOut.play(pg.view, 200, function(){
                public.remove(pg.view);
                if (pg.complement != null){
                    public.remove(pg.splitter);
                    public.remove(pg.complement);
                }
            });
                callback();   
        }
        
    }
    
};


book;

