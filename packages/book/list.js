
var listItem = {
  
    extends : "gui/container",
    
    implementation: function(public, protected, private){
        
        protected.selected = false;
        
        
        public.setListManager = function(l){
            protected.manager = l;
        }
        
        public.onMouseOver(function(){
            
        });
        
        public.onMouseOut(function(){
            
        });
    }
    
};

Class.register("book/list/item", listItem);

var list = {
    
    extends : "gui/container",
    
    implementation : function(public, protected, private){
        public.use({Orientation: "vertical"});
        
    }
    
    
};

list;


