
var theme = {
    
    fadeIn : Display.animations.add(" from { opacity: 0; } to { opacity : 1; }"),
    fadeOut : Display.animations.add(" from { opacity: 1; } to { opacity : 0; }")
}




function Arquivo(public, protected, private){
    Class.extends("gui/container", public, protected);
    public.setBackgroundColor("#fbfbfb");
    public.setMinWidth(455);
    var page = Class.createInstance("gui/container");
    var header = Class.createInstance("gui/container");
    header.setOrientation("horizontal");
    header.setRelativeRect({left : 10, top: 5, right: 10 });
    protected.curViewTop = 50;
    var icon = Class.createInstance("gui/image");
    icon.setSize(40,40);
    icon.setImage("arquivo/os.png");
    function maximize(){
      public.getUIManager().requestFocus(public);  
    }
    icon.onMouseDown(function(){
        maximize();
    })
    
    
    var title = Class.createInstance("gui/text");
    title.setFontSize(14); title.setFontColor("#909090");
    title.setFontWeight("bold"); title.setHeight(40);
    title.setMargin({left: 10, right: 30});
    title.setText("Ordens de Servi&ccedil;os");
    title.onMouseDown(function(){
        maximize();
    })
    
    var search = New("docui/01/searchField", { Float : "right"});
    header.add(icon); header.add(title); header.add(search);
    public.add(header);
    
    protected.header = header;
    protected.icon = icon;
    protected.title = title;
    
    var filters = Class.createInstance("gui/container");
    filters.setRelativeRect({left: 35, right: 25, top: 70});
    filters.setHeight(25);
    //filters.setBackgroundColor("rgba(0,0,0,0.1)");
    filters.setOrientation("horizontal");
    public.add(filters);
    protected.filterSelector = filters;
    protected.filters = [];

    protected.curView = null;
    
    public.setViewMode = function(f){
     var res = protected.curView;
        
        if (protected.curView != null){
            theme.fadeOut.play(protected.curView, 300, function(){
                public.remove(protected.curView);
                protected.curView = f;
                public.add(f); 
                theme.fadeIn.play(f, 300);
                if (protected.data != null)
                    protected.curView.bind(protected.data);
            });
        } else{
            f.setRelativeRect({left: 5, right: 5, bottom: 5, top: protected.curViewTop});
           // f.setShadow({left:0, top: 0, size: 6, color : "rgba(0,0,0,0.4)"});
           f.setBorder({width: 1, color : "#cccccc"});
            protected.curView = f;
            public.add(f);             
        }
    
        return res;
        
    }
    
   /* public.setDefaultView = function(vw){
        protected.defaultMode = vw;
        if (protected.curView == null){
            protected.curView = vw;
            protected.curView.setRelativeRect({left: 25, right: 0, bottom: 0, top: protected.curViewTop});
        }
    }*/
    
    //////////////////////////////////////
    
  /*  
    public.addHeaderButton = function(icon, action, position){
        if (position == null) position = "left";
        
        var btn = Class.createInstance("gui/image");
        btn.setCursor("pointer");
        btn.setSize(35,24);btn.setImage("actions/"+icon+".png");
        btn.setPaddingTop(20);
        btn.onMouseOver(function(){
            btn.setBackgroundColor("rgba(0,0,0, 0.2)");
        });
        
        btn.onMouseOut(function(){
            btn.setBackgroundColor(null);
        });
        
        btn.onMouseDown(function(){
           if (public[action] != null)
               public[action]();
        });
        
        protected.header.add(btn);
        btn.setFloat(position); 
        
        return btn;
        
    }*/
    
    public.setFilter = function(view){
        if (view == null) return;
        view.setRelativeRect({left:10, right: 0, top: 50});
        var h = parseInt(view.getHeight());
        protected.curViewTop = 50+h;
        public.add(view);
    }
    //////////////
    
    public.setTitle = function(txt){
        protected.title.setText(txt);
    }
    
    public.setTitleColor = function(c){
        protected.title.setFontColor(c);
    }
    
    public.setIcon = function(icon){
        protected.icon.setImage("docui_01/archives/"+icon+".png");
       // protected.icon.setImage("bigst.gif");
    }
    
   /* public.addHeaderButton("new", "doCreateNew", "left");
    public.addHeaderButton("remove", "doRemoveSelected", "left");

    public.addHeaderButton("export", "beforeExport", "right");
    public.addHeaderButton("print", "beforeExport", "right");*/
    

    public.setFiles = function(data){
        protected.data = data;
        if (protected.curView != null){
              protected.curView.bind(data);  
              if (protected.curView.selectFirst != null)
                  protected.curView.selectFirst();
        }
    }
    
    public.onSelect = function(callback){
        protected.selectListener = callback;
       // protected.etiquetas.onSelect(callback);
    }
    
    public.onRequestNewFile = function(callback){
        protected.requestNewFile = callback;
    }
}

({
    
    implementation : function(instance, shared){
        Arquivo(instance, shared, {});
    }
    
})

