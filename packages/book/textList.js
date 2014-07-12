

var listItem = {
  
    extends : "gui/container",
    
    implementation: function(public, protected, private){
        
        public.use({Orientation: "horizontal", Height : 15, Padding: 4, BorderBottom: {width:1, color : "#cccccc"} });
        
        
        protected.selected = false;
        protected.status = null;
        protected.text   = New("gui/text", {FontSize : 11, FontColor : "black"});
        public.add(protected.text);
        
        public.setListManager = function(l){
            protected.manager = l;
        }
               
        public.onMouseOver(function(){
            if (protected.selected == true) return;
        });
        
        public.onMouseOut(function(){
           if (protected.selected == true) return; 
        });
        
        public.onMouseDown(function(){
           if (protected.manager != null)
               protected.manager.selectItem(public);
        });
        
        public.setSelected = function(b){
            protected.selected = b;
            if (b == false){
                if (protected.manager != null){
                    public.setBackgroundBrush(protected.manager.getSelectedItemBrush());
                }
            } else{
                public.setBackgroundBrush(null);
            }
        }
        
        public.setData = function(d){
            protected.data = d;
        }
        
        public.getData = function(){
            return protected.data;
        }
        
        
        
        //////////////////////////////////
        
        public.setText = function(txt){
            protected.text.setText(txt);
        }
        
        
    }
    
};

Class.register("book/textList/item", listItem);

var list = {
    
    extends : "gui/container",
    
    implementation : function(public, protected, private){
        public.use({Orientation: "vertical"});
        protected.selected = null;
        
        ///////////////
        
        public.selectItem = function(item){
            if (protected.selected != null)
                protected.selected.setSelected(false);
            
            protected.selected= item;
            item.setSelected(true);
        }
        
        public.setBinding = function(b){
            protected.binding = b;
        }
        
        public.addItem = function(item){
            var i = New(listItem, {Manager: public, Data : item});
            if (protected.binding != null)
                i.setText(item[protected.binding]);
            else i.setText(item.toString());
            public.add(i);
            return i;
        }
        
    }
    
    
};

list;