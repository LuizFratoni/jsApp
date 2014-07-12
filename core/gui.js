/*
 *  Standard Graphic User Interface Library for JS Class Foundation
 *  Developped by Luiz Fratoni (luizfratoni@gmail.com)
 *  Creation Date: 01/04/2014
 *  
 *  TODO: 
 *  - Create Default BUTTON View
 *  - Create Canvas Object
 *  - Create a UI Auto-constructor Schema like { extends : "gui/container", items : [ { extends : "gui/text", Text : "Olá amigos da Rede Globo" }]
 *  - Create a Animation Class (With Custom and CSS ANimations) - StaticAnimation = CSS | DynamicaAnimation = Javascript Timeline
 *  - Work with SVG images
 *  - Work with Icon Fonts
 */

var GUI_VERSION = "0.1.1.17";

function DisplayImpl(){
    var self = this;
    this.stylesheets = {};
    this.stylesheets.count = 0;
    
    this.animations = {};
    
    //var docHead ;
    var clip = {left: "0px", top: "0px", right : "0px", bottom: "0px" };
       
        
    function createBodyStyle(){
        var css = document.createElement("style");
        css.appendChild( document.createTextNode("body { padding: 0px; vertical-align: middle;  margin: 0px; font-family: helvetica; -webkit-text-size-adjust: none; cursor: default; user-select: none; -webkit-user-select: none; overflow: hidden; background-color: #eeeeee; -webkit-touch-callout: none; -webkit-text-size-adjust: none; }" ) );
        window.document.getElementsByTagName("head")[0].appendChild(css);
        
        css = document.createElement("style");
        css.appendChild (document.createTextNode(" * { -webkit-tap-highlight-color: rgba(0,0,0,0); }"));
        window.document.getElementsByTagName("head")[0].appendChild(css);
    }   
    
    this.stylesheets.add = function(text){
        var styleNode = new Object();
        styleNode.name = "css_class_"+(++self.stylesheets.count);
        
        var cssText = "."+styleNode.name +" { "+text + "}";
        
        var css = document.createElement("style");
        css.appendChild( document.createTextNode(cssText));
        window.document.getElementsByTagName("head")[0].appendChild(css);
        
        styleNode.applyTo = function(obj){
          if (obj.getDOMElement != null) obj.getDOMElement().className = styleNode.name;
          else obj.className = styleNode.name;
        };
        
        styleNode.dispose = function(){
            window.document.getElementsByTagName("head")[0].removeChild(css);
        };
        styleNode.node = css;
        return styleNode;      
    }
      
    this.stylesheets.get = function(clsName){
        var styleNode = {};
        styleNode.name = clsName;
        styleNode.applyTo = function(obj){
          if (obj.getDOMElement != null) obj.getDOMElement().className = styleNode.name;
          else obj.className = styleNode.name;
        };
        styleNode.dispose = function(){
            
        }
        return styleNode;
               
    }
    
    this.animations.add = function(text){
        var styleNode = new Object();
        styleNode.name = "css_anim_"+(++self.stylesheets.count);
        
        var cssText = "@-webkit-keyframes "+styleNode.name +" { "+text + "}";
        
        var css = document.createElement("style");
        css.appendChild( document.createTextNode(cssText));
        window.document.getElementsByTagName("head")[0].appendChild(css);
        
        styleNode.node = css;
        styleNode.play = function(obj, duration, onEnd){Display.animate(obj, styleNode, duration, onEnd); }
        styleNode.dispose = function(){
            window.document.getElementsByTagName("head")[0].removeChild(css);
        }
        return styleNode;        
    }
    
    this.animations.get = function(name){
        var styleNode = new Object();
        styleNode.name = name;
        styleNode.play = function(obj, duration, onEnd){Display.animate(obj, styleNode, duration, onEnd); }
        styleNode.dispose = function(){
            
        }
    }
     
    this.animate = function(view, animation, duration, onEnd){
            var element;
            if (view.getDOMElement != null) element = view.getDOMElement();
            else element = view;
            

            element.style.webkitAnimationPlayState = "";
            element.style.webkitAnimationName = "";

           
           element.style.webkitAnimation = animation.name+" "+duration+"ms forwards";
        
            var animEnd = function(){
                element.removeEventListener("webkitAnimationEnd", animEnd);
                if (onEnd != null) onEnd();
            };
            
            element.addEventListener("webkitAnimationEnd", animEnd);
            element.style.webkitAnimationPlayState = "running";
    }
    
    
    this.clipRect = function(r){
        clip = r;
    }
    
    this.getClipRect = function(){
        return clip;
    }
    
    this.getParent = function(){
        return document.body;
    }
    
    /////////////////////////////////////////////////////////////////////////

    this.newSite = function(){
        var site = {};
        Site(site, {}, {});
        return site;                
    }
    
    this.setBackgroundColor = function(){
        
    }
    
        this.add = function(obj){
         document.body.appendChild(obj.getDOMElement());
    }
    
    this.remove = function(obj){
         document.body.removeChild(obj.getDOMElement());
    }
    
    createBodyStyle();
}



var Display = new DisplayImpl();


/////////////////////////////////////////////////////////////////////////////


function View(instance, shared, private){
     
    if (shared.element == null) shared.element = document.createElement("div");
    shared.displayMode = "block";
    shared.prefSize = null;
    shared.parent = null;
    shared.uiManager = null;
    
    instance.getDOMElement = function(){
        return shared.element;
    }
    
    instance.setParent = function(p){
        shared.parent = p;
    }
    
    instance.getParent = function(){
        return shared.parent;
    }
    
    instance.use = function(attr){
        Class.applyProperties(instance, attr);
    }
    
    instance.getUIManager = function(){
        if (shared.uiManager == null){
            if (shared.parent != null) return shared.parent.getUIManager();
            else return null;
        }
        return shared.uiManager;
    }
    
    instance.setUIManager = function(ui){
        shared.uiManager = ui;
    }
    
    shared.setPreferredSize = function(w, h){
        shared.prefSize = {};
        shared.prefSize.width = w;
        shared.prefSize.height = h;
        
    }
    
    shared.setPreferredWidth = function(w){
        if (shared.prefSize == null){
            shared.prefSize = {};
            shared.prefSize.height = null;
        }
        shared.prefSize.width = w;
    }
    
   shared.setPreferredWidth = function(h){
        if (shared.prefSize == null){
            shared.prefSize = {};
            shared.prefSize.width = null;
        }
            shared.prefSize.width = h;
   }
    
    instance.getPreferredSize = function(){
        return shared.prefSize;
    }
    
    instance.getPreferredWidth = function(){
        return shared.prefSize.width;
    }
    
    instance.getPreferredHeight = function(){
        return shared.prefSize.height;
    }
    
    instance.setWidth = function(value){
        if (value == null) shared.element.style.width = "auto";
        else shared.element.style.width = value+"px";   
    }
    
    instance.getLeft = function(){
        var res = shared.element.style.left;
        res = res.substring(0, res.length-2);
        return res;
    }
    
    instance.getTop = function(){
        var res = shared.element.style.top;
        res = res.substring(0, res.length-2);
        return res;
    }
    
    instance.getWidth = function(){
        var res = shared.element.style.width;
        res = res.substring(0, res.length-2);
        return res;
    }
    
    instance.setHeight = function(value){
        shared.element.style.height = value+"px";
    }
    
    instance.getHeight = function(){
        var h = shared.element.style.height;
        if (h != null)
             h = h.substring(0, h.length-2);
        return h;
    }
    
    instance.setLeft = function(value){
        shared.element.style.left = value+"px";
    }
    
    instance.setTop = function(value){
        shared.element.style.top = value+"px";
    }

    instance.setSize = function(w, h){
        if (w != null) shared.element.style.width = w+"px";
        if (h != null) shared.element.style.height = h+"px";
    }
    
    instance.setPosition = function(x, y){
        
        if (x != null) shared.element.style.left = x+"px";
        if (y != null) shared.element.style.top = y+"px";
    }
    
    instance.setVisible = function(value){
      if (shared.element.style.display != "none" && shared.element.style.display != null && shared.element.style.display != "")
           shared.displayMode = shared.element.style.display;
       
       if (value == false){
           shared.element.style.display = "none";
       } else {
           shared.element.style.display = shared.displayMode;
       }
    }
    
    instance.setOpacity = function(value){
        shared.element.style.opacity = value;        
    }
    
    instance.setPositionMode = function(value){
        shared.element.style.position = value;
    }
    
    instance.setBackgroundColor = function(value){
        shared.element.style.backgroundColor = value;
    }
    
    instance.getBackgroundColor = function(){
       return shared.element.style.backgroundColor;
    }
    
    instance.setBackgroundBrush = function(value){
        if (value != null)
            shared.element.style.background = value.getCSSBrush();
        else {
            shared.element.style.background = null;
        }
    }
    
    instance.setBackgroundImage = function(value){
        shared.element.style.backgroundImage = "url("+GUI.resourcePath+value+")";
    }
    
    instance.setFloat = function(value){
        shared.element.style.float = value;
    }
    
    instance.setDisplay = function(value){
        shared.element.style.display = value;
        shared.displayMode = value;
    }
    
    instance.setBorderRadius = function(value){
        shared.element.style.borderRadius = value+"px";
    }
    
    instance.setRelativeRect = function(r){
        var pos = shared.element.style.position;
        if (pos == null || pos == "relative")
                shared.element.style.position = "absolute";
        if (r.left != null) shared.element.style.left = r.left+"px";
        if (r.top != null) shared.element.style.top = r.top+"px";
        if (r.bottom != null) shared.element.style.bottom = r.bottom+"px";
        if (r.right != null) shared.element.style.right = r.right+"px";
    }   
    
    instance.setPadding = function(p){
        if (p==null) return;
        if (p.constructor != Object){ shared.element.style.padding = p+"px"; return; }
        if (p.left != null) shared.element.style.paddingLeft = p.left+"px";
        if (p.top  != null) shared.element.style.paddingTop  = p.top+"px";
        if (p.bottom != null) shared.element.style.paddingBottom = p.bottom+"px";
        if (p.right != null) shared.element.style.paddingRight = p.right+"px";
    }
    instance.setPaddingLeft = function(p){
        shared.element.style.paddingLeft = p+"px";
    }
    instance.setPaddingTop = function(p){
        shared.element.style.paddingTop = p+"px";
    }
    instance.setPaddingBottom = function(p){
        shared.element.style.paddingBottom = p+"px";
    }
    instance.setPaddingRight = function(p){
        shared.element.style.paddingRight = p+"px";
    }

    instance.setMargin = function(p){
        if (p.left != null) shared.element.style.marginLeft = p.left+"px";
        if (p.top  != null) shared.element.style.marginTop  = p.top+"px";
        if (p.bottom != null) shared.element.style.marginBottom = p.bottom+"px";
        if (p.right != null) shared.element.style.marginRight = p.right+"px";
    }
    
    instance.setMarginLeft = function(p){
        shared.element.style.marginLeft = p+"px";
    }
    instance.setMarginTop = function(p){
        shared.element.style.marginTop = p+"px";
    }
    instance.setMarginBottom = function(p){
        shared.element.style.marginBottom = p+"px";
    }
    instance.setMarginRight = function(p){
        shared.element.style.marginRight = p+"px";
    }
    
    instance.setBorderBottom = function(d){
        if (d == null) { shared.element.style.borderBottom = null; return }
        var style = "solid";
        if (d.style != null) style = d.style;
        shared.element.style.borderBottom = d.width+"px "+style+" "+d.color;
    }
    
    instance.setBorderRight = function(d){
        if (d == null) { shared.element.style.borderRight = null; return }
        var style = "solid";
        if (d.style != null) style = d.style;
        shared.element.style.borderRight = d.width+"px "+style+" "+d.color;
    }
    
    instance.setBorderLeft = function(d){
        if (d == null) { shared.element.style.borderLeft = null; return }
        var style = "solid";
        if (d.style != null) style = d.style;
        shared.element.style.borderLeft = d.width+"px "+style+" "+d.color;
    }
    
    instance.setBorderTop = function(d){
        if (d == null) { shared.element.style.borderTop = null; return }
        var style = "solid";
        if (d.style != null) style = d.style;
        shared.element.style.borderTop = d.width+"px "+style+" "+d.color;
    }
    
    instance.setBorder = function(d){
        if (d == null) shared.element.style.border = null;
        else {
            var style = "solid";
            if (d.style != null) style = d.style;
            shared.element.style.border = d.width+"px "+style+" "+d.color;
        }
    }
    
    instance.expand = function(){
        shared.element.style.position = "absolute";
        shared.element.style.left = "0px";
        shared.element.style.top = "0px";
        shared.element.style.bottom = "0px";
        shared.element.style.right = "0px";
    }
    
    instance.expandRight = function(){
    //    shared.element.style.width = "100%";
        if (shared.element.style.position == "absolute")
            shared.element.style.right = "0px";
        else shared.element.style.width = "100%";
    }
    
    instance.expandBottom = function(){
        shared.element.style.bottom = "0px";
    }
    
    instance.setStyleClass = function(cls){
        shared.element.className = cls.name;
    }
    
    instance.setStyle = function(cls){
        shared.element.style.cssText = cls;
        //TODO: IF a string set the CSSTEXT if OBJECT,
        //set the style like the LAYOUT CLASS
    }
    
    instance.setScale = function(x,y){
        shared.element.style.webkitTransform = "scale("+x+", "+y+")";
    }
    
    instance.setShadow = function(opt){
        if (opt == null){
            shared.element.style.boxShadow = null;
        } else{
            var l, t,s,c;
            if (opt.left != null) l = opt.left+"px";
            else l = "0px";
            if (opt.top != null) t = opt.top+"px";
            else t = "0px";
            if (opt.size != null) s = opt.size+"px";
            else s = "4px";
            
            if (opt.color != null) c = opt.color;
            else c = "#909090";
            
            shared.element.style.boxShadow = l+" "+t+" "+s+" "+c;
            
        }
        
    }
    
    instance.setBlur = function(sz){
       shared.element.style.filter = "blur("+sz+"px)";
       shared.element.style.webkitFilter = "blur("+sz+"px)";
    }
    
    instance.setInnerShadow = function(opt){
        if (opt == null){
            shared.element.style.boxShadow = null;
        } else{
            var l, t,s,c;
            if (opt.left != null) l = opt.left+"px";
            else l = "0px";
            if (opt.top != null) t = opt.top+"px";
            else t = "0px";
            if (opt.size != null) s = opt.size+"px";
            else s = "4px";
            
            if (opt.color != null) c = opt.color;
            else c = "#909090";
            
            shared.element.style.boxShadow = "inset "+l+" "+t+" "+s+" "+c;
            
        }
        
    }
    
    
    
    
    instance.setExpanded = function(b){
        if (b == true) instance.expand();
    }
    
    instance.setExpandWidth = function(b){
        if (b == true) instance.expandRight();
    }
    
     instance.setExpandHeight = function(b){
        if (b == true) instance.expandBottom();
    }
    
    instance.setMinHeight = function(v){
        shared.element.style.minHeight = v+"px";
    }
    
    instance.setMinWidth = function(v){
        shared.element.style.minWidth = v+"px";
    }
    
    instance.setAutoSize = function(b){
        if (b == true){
            shared.displayMode = "table";
            shared.element.style.display = "table";
        }
    }
    //////////////////////// evetns
    
    instance.onMouseOver  = function(callback){
        shared.element.onmouseover = callback;
    }
    
    instance.onMouseOut  = function(callback){
        shared.element.onmouseout = callback;
    }
    
    instance.onMouseDown  = function(callback){
        shared.element.onmousedown = callback;
    }
    
    instance.onMouseUp  = function(callback){
        shared.element.onmouseup = callback;
    }

    instance.onClick  = function(callback){
        shared.element.onclick = callback;
    }  
    
    instance.setCursor = function(cr){
        shared.element.style.cursor = cr;
    }
    
    
    
}

function Container(instance, shared, private){
    shared.orientation = null;
    shared.horAlign = "left";
    shared.element.style.overflowX = "hidden";
    shared.element.style.overflowY = "hidden";
    
    instance.add = function(vw){
        if (vw.getDOMElement == null){
            Console.error("[Container]Invalid View to add");
            return;
        }
        var el = vw.getDOMElement();
        if (shared.orientation != null){
              if (shared.orientation == "horizontal"){
                  if (el.style.position != "fixed"){
                    if (el.style.float == null || el.style.float == "")
                        el.style.float = shared.horAlign;
                  }
                 
             }
        } else{
            if (el.style.position == null || el.style.position == "" || el.style.position == "relative")
                el.style.position = "absolute";
        }
        shared.element.appendChild(el);
        if (vw.setParent != null)
            vw.setParent(instance);
    }
    
    instance.remove = function(vw){
        var el = vw.getDOMElement();
        shared.element.removeChild(el);
        if (vw.setParent != null)
            vw.setParent(null);
    }
    
    
    instance.clear = function(){
        shared.element.innerHTML = "";
    }
    
    instance.setOrientation = function(or){
        shared.orientation = or;
    }
    
    instance.setHorizontalAlign = function(al){
        shared.horAlign = al;
    }
    
    instance.enableVerticalScroll = function(value){
        if (value== true)
            shared.element.style.overflowY = "auto";
        else shared.element.style.overflowY = "hidden";
    }
    
    instance.enableHorizontalScroll = function(value){
        if (value== true)
            shared.element.style.overflowX = "auto";
        else shared.element.style.overflowX = "hidden";
    }
    
    instance.enableScroll = function(value){
        if (value== true){
            shared.element.style.overflowY = "auto";
            shared.element.style.overflowX = "auto";
        }
        else{
            shared.element.style.overflowY = "hidden";
            shared.element.style.overflowX = "hidden";
        }
    }
    
    instance.addMultiple = function(items){
        items.forEach(function(item){
            instance.add(item);
        });
    }
    
    instance.swap = function(item, newitem){
        shared.element.insertBefore(newitem.getDOMElement(), item.getDOMElement());
        shared.element.removeChild(item.getDOMElement());
        if (item.setParent != null) item.setParent(null);
        if (newitem.setParent != null) newitem.setParent(instance);
    }
    
    instance.onScroll = function(f){
        shared.onScrollFunc = f;
        shared.element.onscroll = function(e){
            shared.onScrollFunc(e, shared.element.scrollTop, shared.element.scrollLeft);
        }
    }
    
    //////////////////////////////////////////////////////////////////
    

}

function ImageView(instance, shared, private){
    shared.element.style.backgroundPosition = "center";
    shared.element.style.backgroundRepeat = "no-repeat";
    
    instance.setImage = function(img){
        shared.element.style.backgroundImage = "url("+GUI.resourcePath+img+")";
    }
    
    instance.setImageAlign = function(value){
        shared.element.style.backgroundPosition = value;
    }
}


function Paragraph(instance, shared, private){
 
    shared.element.overflowY = "auto";
    instance.setText = function(txt){
        if (txt == null)
            shared.element.textContent = "";
        else shared.element.textContent = txt;
    }
    
    instance.setSimpleDate = function(dt){
        if (dt.constructor != Date) 
            dt = new Date(dt);
        shared.element.textContent =  dt.getDate() + "/" + (dt.getMonth()+1) + "/" + dt.getFullYear();
    }
    
    instance.setHtml = function(txt){
        shared.element.innerHTML  = txt;
    }
    
    instance.getText = function(){
        return shared.element.textContent;
    }
    
    instance.getHtml = function(){
        return shared.element.innerHTML;
    }
    
    instance.setFontColor = function(color){
        shared.element.style.color = color;
    }
    
    instance.getFontColor = function(){
        var res = shared.element.style.color;
        if (res == null) res = "#000000";
        return res;
    }
    
    instance.setFontSize = function(size){
        shared.element.style.fontSize = size+"px";
    }
    
    instance.setFontFamily = function(family){
        shared.element.style.fontFamily = family;
    }
    
    instance.setFontWeight = function(weight){
        shared.element.style.fontWeight = weight;
    }

    instance.setLineHeight = function(h){
        shared.element.style.lineHeight = h+"px";
    }
    
    instance.setVerticalAlign = function(a){
        shared.element.style.verticalAlign = a;
    }
    
    instance.setAlign = function(al){
        shared.element.style.textAlign = al;
        shared.element.style.align = al;
    }
    


}

function Text(instance, shared, private){

    private.baseSetHeight = instance.setHeight;
    shared.multiline = false;
    
    instance.setMultiline = function(b){
        shared.multiline = b;
        
        shared.element.style.lineHeight = null;
    }
    
    instance.setHeight = function(h){
        shared.element.style.height = h+"px";
        if (shared.multiline == false)
            shared.element.style.lineHeight = h+"px";
        
    }
 
    instance.setSize = function(w,h){
        shared.element.style.width = w+"px";
        shared.element.style.height = h+"px";
        if (shared.multiline == false)
            shared.element.style.lineHeight = h+"px";        
    }   
  
    instance.enableVerticalScroll = function(value){
        if (value== true)
            shared.element.style.overflowY = "auto";
        else shared.element.style.overflowY = "hidden";
    }
    
    instance.enableHorizontalScroll = function(value){
        if (value== true)
            shared.element.style.overflowX = "auto";
        else shared.element.style.overflowX = "hidden";
    }
    
    instance.enableScroll = function(value){
        if (value== true){
            shared.element.style.overflowY = "auto";
            shared.element.style.overflowX = "auto";
        }
        else{
            shared.element.style.overflowY = "hidden";
            shared.element.style.overflowX = "hidden";
        }
    }
    
    instance.setTextShadow = function(opt){
        if (opt == null){
            shared.element.style.textShadow = null;
        } else{
            var l, t,s,c;
            if (opt.left != null) l = opt.left+"px";
            else l = "0px";
            if (opt.top != null) t = opt.top+"px";
            else t = "0px";
            if (opt.size != null) s = opt.size+"px";
            else s = "4px";
            
            if (opt.color != null) c = opt.color;
            else c = "#909090";
            
            shared.element.style.textShadow = l+" "+t+" "+s+" "+c;
            
        }
        
    }
    
}

function Label(instance, shared, private){
    shared.element.style.backgroundPosition = "5 5";
    shared.element.style.backgroundRepeat = "no-repeat";
    shared.element.style.paddingLeft = "32";
    
    
    instance.setImage = function(img){
        shared.element.style.backgroundImage = "url("+GUI.resourcePath+img+")";
    }
    
    instance.setImagePosition = function(x, y){
        shared.element.style.backgroundPosition = x+" "+y;
    }
    
    
    
}

////////////////////////////////////////////////////////////////////////////////

function Input(instance, shared, private, type){
    if (type == null)
        shared.element = document.createElement("input");
    else shared.element = document.createElement(type);
    
    instance.setFocus = function(b){
        if (b == true) shared.element.focus();
        else shared.element.blur();
    }
    
    shared.element.onfocus = function(e){
        if (shared.onfocus != null) shared.onfocus(instance);
    }
    
    shared.element.onblur = function(e){
        if (shared.onexitfocus != null) shared.onexitfocus(instance);
    }    
}


function Checkbox(instance, shared, private){
    shared.element.type = "checkbox";
}

function TextInput(instance, shared, private){  
    shared.element.type = "text";
    shared.onkeyup = null;
    shared.onkeydown = null;
    shared.onpressenter = null;
    shared.onpressesc = null;
    shared.onfocus = null;
    shared.onexitfocus = null;
    
    instance.getText = function(){
        return shared.element.value;
    }
    
    instance.setText = function(t){
        shared.element.value = t;
    }
    
    instance.clear = function(){
        shared.element.value = "";
    }
    
    instance.setMaxLength = function(sz){
        shared.element.maxLength = sz;
    }

       
    shared.element.onkeydown = function(e){
               if (shared.onkeydown != null) shared.onkeydown(instance, e);
               
    }
    
    shared.element.onkeyup = function(e){
            if (shared.onkeyup != null) shared.onkeyup(instance, e);
            if (e.keyCode == 13){
                if (shared.onpressenter != null) shared.onpressenter(instance, e);
            } else if (e.keyCode == 27){
                if (shared.onpressesc != null) shared.onpressesc(instance, e);
            }
    }
    
    
    instance.onKeyUp = function(callback){
        shared.onkeyup = callback;
    }
    
    instance.onKeyDown = function(callback){
        shared.onkeydown = callback;
    }
    
    instance.onKeyPress = function(callback){
        shared.element.onkeypress = callback;
    }
    
    instance.onPressEnter = function(callback){
        shared.onpressenter = callback;
    }
    
    instance.onPressEsc = function(callback){
        shared.onpressesc = callback;
    }
    
    instance.onFocus = function(callback){
        shared.onfocus = callback;
    }
    
    instance.onExitFocus = function(callback){
        shared.onexitfocus = callback;
    }
}


function MultilineText(instance, shared, private){
    shared.element = document.createElement("textarea");
    shared.multiline = true; 
 
}

function PasswordInput(instance, shared, private){

    shared.element.type = "password";
    
}


function DateInput(instance, shared, private){

    shared.element.type = "text";
    
    shared.onchange = null;
    
    instance.onChange = function(callback){
        shared.onchange = callback;
        shared.element.onchange = function(e){
            shared.onchange(instance, e);
        }
    }
    
    instance.setValue  =function(dt){
        var d = String(dt.getDate());
        if (d.length <= 1) d = "0"+d;
        var m = String(dt.getMonth()+1);
        if (m.length <= 1) m = "0"+m;
        v = dt.getFullYear() + "-" + m + "-" + d;
        shared.element.value = v;
    }
    
    instance.setDate = function(dt){
        var d = String(dt.getDate());
        if (d.length <= 1) d = "0"+d;
        var m = String(dt.getMonth()+1);
        if (m.length <= 1) m = "0"+m;
        var v = d+ "/"+ m+ "/" +dt.getFullYear();
        shared.element.value = v;
    }
    
    instance.toText = function(){
        var value = shared.element.value;
        try{
            
            var nodes = value.split("/");
            if (nodes.length != 3) return null;
            
            
            var dt = new Date(nodes[2],nodes[1]-1, nodes[0]);
            var d = String(dt.getDate());
            var m = String(dt.getMonth()+1);
            var v = d+ "/"+ m+ "/" +dt.getFullYear();
            return v;
        } catch(err){
            alert(err);
            return null;
        }
    }
    
    instance.getValue = function(){
        return shared.element.value;
    }
}

function ComboInput(instance, shared, private){
    
    instance.add = function(text, id){
        var d = document.createElement("option");
        d.value = id;
        d.text = text;
        shared.element.add(d);
    }
    
    instance.clear = function(){
        shared.element.innerHTML = ""; 
    }
    
    instance.bind = function(data, params){
        instance.clear();
        instance.addItems(data, params);
    }
    
    instance.addItems = function(data, params){
        var capId = "id";
        var capText = "text";
         if (params != null){
            if (params.text != null) capText = params.text;
            if (params.id != null) capId = params.id;
        }
        
        data.forEach(function(entry){
            if (entry != null)
                instance.add(entry[capText], entry[capId]);
        });
    }
    
    instance.getSelectedIndex = function(){
        return shared.element.selectedIndex;
    }
    
    instance.getSelected = function(){
        var i = shared.element.selectedIndex;
        if (i < 0) return null;
        return shared.element.options[i].value;
    }
    
    instance.count = function(){
        return shared.element.options.length;
    }
    
    instance.selectIndex = function(i){
        shared.element.selectedIndex = i;
        if (shared.onchange != null) shared.onchange(instance, null);
    }
    
    ////////////////
    
    shared.onchange = null;
    shared.onselect = null;
    
    instance.onChange = function(callback){
        shared.onchange = callback;
        shared.element.onchange = function(e){
            shared.onchange(instance, e);
        }
    }
    
    instance.onSelect = function(callback){
        shared.onselect = callback;
        shared.element.onselect = function(e){
            shared.onselect(instance, e);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////


function Hover(instance, shared, private){
    if (GUI.hoverAnims == null){
        var anims = {
            show : Display.animations.add(" from { opacity : 0; } to { opacity: 1; } "), 
            hide : Display.animations.add(" from { opacity : 1; } to { opacity: 0; } ") 
        };
        GUI.hoverAnims = anims;
    }
    
    shared.element.style.position = "fixed";
    
    instance.setAxisElement = function(obj, margin){
        var rect = obj.getDOMElement().getBoundingClientRect();
        
        if (margin != null){
            if (margin.left != null)
                shared.element.style.left = rect.left+2+margin.left;
            else shared.element.style.left = rect.left+2;
            if (margin.top != null){                
                shared.element.style.top = rect.top+rect.height-10+ margin.top;
            } else shared.element.style.top = rect.top+rect.height-10; 
        } else{
            shared.element.style.left = rect.left+2;
            shared.element.style.top = rect.top+rect.height-10; 
        }
        var a = shared.element.getBoundingClientRect();
                if (a.right > window.innerWidth)
                    shared.element.style.left = window.innerWidth-shared.element.offsetWidth;
                if (a.bottom > window.innerHeight)
                    shared.element.style.top = window.innerHeight-shared.element.offsetHeight;
                
    }
    
    instance.show = function(el, onHide, margin){
        
        Display.add(instance);
        
        shared.onHide = onHide;
        if (el != null){
            instance.setAxisElement(el, margin);
            
        }
        

        GUI.hoverAnims.show.play(instance, 200, function(){
            GUI.onClickOutside(instance, function(){
                instance.hide(null);
            });              
        }); 

            
    }
    
    instance.hide = function(data){
       GUI.hoverAnims.hide.play(instance, 200, function(){
           Display.remove(instance);
       });   
       if (shared.onHide != null)
        shared.onHide(data);
    }
    
    instance.close = function(data){
       GUI.hoverAnims.hide.play(instance, 200, function(){
           Display.remove(instance);
       });   
       GUI.cancelClickOutside(instance);
    }
    
}


////////////////////////////////////////////////////////////////////////////////



var gui_styles = null;
var gui_anim   = null;

function createGuiStyles(){
    
    gui_styles = {};
    gui_anim = {};
    var clip = Display.getClipRect();
    
    gui_styles.site = Display.stylesheets.add("position: fixed; left: "+clip.left+"; top: "+clip.top+"; right: "+clip.right+"; bottom: "+clip.bottom+"; ");
    gui_styles.floatSite  = Display.stylesheets.add("position: absolute; background-color: #ffffff; box-shadow: 0px 0px 15px #303030; display: table;");
    
    gui_anim.fadeIn = Display.animations.add("from {opacity: 0;} to {opacity: 1;}");
    gui_anim.fadeOut = Display.animations.add("from {opacity: 1;} to {opacity: 0;}");
    
}

function Site(instance, shared, private){
    if (gui_styles == null){
        createGuiStyles();
    }
    
    instance.setStyleClass(gui_styles.site);
    instance.setView = function(vw){
        shared.element.innerHTML = null;
        shared.element.appendChild(vw.getDOMElement());
    }
    
    instance.setVisible = function(b){
        if (b == true){
            shared.element.style.opacity = "0";
            Display.getParent().appendChild(shared.element);
            gui_anim.fadeIn.play(instance, "500ms", function(){
                shared.element.style.opacity = "1";
            });
        }
        else{
            gui_anim.fadeOut.play(instance, "500ms", function(){
                Display.getParent().removeChild(shared.element); 
            });
        }
    }
    
    instance.setFloating = function(value){

       if (value == true){
            instance.setStyleClass(gui_styles.floatSite);
       } else{
           instance.setStyleClass(gui_styles.site);
       }

    }
    
    instance.setAxisElement = function(){
        var rect = obj.getBoundingClientRect();
        shared.element.style.left = rect.left+2;
        shared.element.style.top = rect.top+rect.height-10; 
    }
    
}

////////////////////////////////////////////////////////////////////////////////

function Graphic(instance, shared, private){
    shared.element = document.createElement("object");
    shared.element.type = "image/svg+xml";
    
    instance.setImage = function(uri){
        shared.element.data = uri;
    }
    
    
}

function SVGViewer(instance, shared, private){
    
    shared.element = document.createElement("object");
    shared.element.type = "image/svg+xml";
    
    instance.load = function(uri, callback){
        shared.element.data = GUI.resourcePath+uri;
        shared.element.onload = function() { callback(shared.element.contentDocument); };
    }    
    
}

function HTMLViewer(instance, shared, private){
    
    shared.element = document.createElement("object");
    shared.element.type = "text/html";
    
    instance.loadResource = function(uri, callback){
        shared.element.data = GUI.resourcePath+uri;
        shared.element.onload = function() { callback(shared.element.contentDocument); };
    }    
    
    instance.loadUrl = function(uri, callback){
        shared.element.data = uri;
        shared.element.onload = function() { callback(shared.element.contentDocument); }; 
    }
}

function Viewport(instance, shared, private){
    
    shared.iframe = document.createElement("iframe");
    shared.iframe.style.width = "100%";
    shared.iframe.style.height = "100%";
    shared.iframe.style.position = "absoulte";
    shared.iframe.style.top = "0px";
    shared.iframe.style.left = "0px";
    shared.element.appendChild(shared.iframe);
   // shared.element.type = "image/svg+xml";
    
    /*instance.load = function(uri, callback){
        shared.element.data = GUI.resourcePath+uri;
        shared.element.onload = function() { callback(shared.element.contentDocument); };
    }  */  
    
    instance.setSource = function(src){
        shared.iframe.src = src;
    }
}

function Embedded(instance, shared, private){
    
    shared.iframe = document.createElement("embed");
    shared.iframe.style.width = "100%";
    shared.iframe.style.height = "100%";
    shared.iframe.style.position = "absoulte";
    shared.iframe.style.top = "0px";
    shared.iframe.style.left = "0px";
    shared.element.appendChild(shared.iframe);
   // shared.element.type = "image/svg+xml";
    
    /*instance.load = function(uri, callback){
        shared.element.data = GUI.resourcePath+uri;
        shared.element.onload = function() { callback(shared.element.contentDocument); };
    }  */  
    
    instance.setSource = function(src){
        shared.iframe.data = src;
    }
    
    instance.setType = function(type){
        shared.iframe.type = type;
    }
    
    instance.getObject = function(){
        return shared.iframe;
    }
}
////////////////////////////////////////////////////////////////////////////////

function LinearGradientBrush(instance, shared, private){
    
    shared.from = "#000000";
    shared.to = "#ffffff";
    shared.direction = "left";
    
    instance.horizontal = function(f,t){
        shared.from = f;
        shared.to = t;
        shared.direction = "left";
    }
    
    instance.vertical = function(f,t){
        shared.from = f;
        shared.to = t;
        shared.direction = "top";
    }
    
    instance.diagonal = function(f,t){
        shared.from = f;
        shared.to = t;
        shared.direction = "left top";
    }
    
    instance.angled = function(a,f,t){
        shared.from = f;
        shared.to = t;
        shared.direction = a+"deg";
    }
    
    instance.getCSSBrush = function(){
        return "-webkit-linear-gradient("+shared.direction+","+shared.from+", "+shared.to+")";
        
    }
    
    
}

////////////////////////////////////////////////////////////////////////////////

var clickOutListener = null;

var gui_popup_h = [];

var GUI = {
        version : GUI_VERSION,
        resourcePath : "resources/",
        
        View : {
            implementation : function(instance, shared){
                View(instance, shared, {});
            }
        },
        Container :{
            implementation : function(instance, shared){
                GUI.View.implementation(instance, shared);
                Container(instance, shared,  {});
            }
        },
        Image:{
            implementation : function(instance, shared){ GUI.View.implementation(instance, shared); ImageView(instance, shared, {}); },
            characterize : function(instance, shared) { ImageView(instance, shared, {}); }
        },
        Paragraph :{
            implementation : function(instance, shared){ GUI.View.implementation(instance, shared); Paragraph(instance, shared, {}); },
        },
        Text :{
            implementation : function(instance, shared){ GUI.Paragraph.implementation(instance, shared); Text(instance, shared, {}); },
        },
        Label:{
            implementation : function(instance, shared){ GUI.Text.implementation(instance, shared); Label(instance, shared, {}); }
        },
        Input : {
            implementation : function(instance, shared, type){ GUI.View.implementation(instance, shared); Input(instance, shared, {}, type); }
        },       
        Checkbox : {
            implementation : function(instance, shared){ GUI.Input.implementation(instance, shared); Checkbox(instance, shared, {}); }
        },
        TextInput :{
            implementation : function(instance, shared){ GUI.Text.implementation(instance, shared); GUI.Input.implementation(instance,shared); TextInput(instance, shared, {}); }
        },
        MultilineText : {
            implementation : function(instance, shared){ GUI.TextInput.implementation(instance, shared); MultilineText(instance, shared, {}); }
        },
        PasswordInput :{
            implementation : function(instance, shared){ GUI.TextInput.implementation(instance, shared) ; PasswordInput(instance, shared, {}); }
        },
        DateInput :{
            implementation : function(instance, shared){ GUI.Text.implementation(instance, shared); GUI.Input.implementation(instance,shared); DateInput(instance, shared,{}); }
        },
        ComboInput:{
            implementation : function(instance, shared){ GUI.Text.implementation(instance, shared); GUI.Input.implementation(instance,shared, "select"); ComboInput(instance, shared,{}); }
        },
        Site : {
            implementation  : function(instance, shared) { GUI.View.implementation(instance, shared); Site(instance, shared, {});}
        },
        SVGView :{
            implementation : function(instance, shared) { GUI.View.implementation(instance, shared); SVGViewer(instance, shared); }
        },
        WebView :{
            implementation : function(instance, shared) { GUI.View.implementation(instance, shared); HTMLViewer(instance, shared); }
        },
        Viewport :{
             implementation : function(instance, shared) { GUI.View.implementation(instance, shared); Viewport(instance, shared); }
        },
        Embedded :{
             implementation : function(instance, shared) { GUI.View.implementation(instance, shared); Embedded(instance, shared); }
        },
        Hover : {
            implementation : function(instance, shared) { GUI.Container.implementation(instance, shared); Hover(instance, shared, {}); }
        },
                
         /////////////////////////////////
 
         Brushes : {
             LinearGradient : { implementation : function(instance, shared) { LinearGradientBrush(instance, shared, {}); } }            
         },
             
         cancelClickOutside : function(obj){
            var l = null;
            gui_popup_h.forEach(function(item){
                if (item.obj == obj) l = item;
            })
            if (l != null)
             gui_popup_h.remove(l);
         },
         
         onClickOutside : function(obj, callback, ignoreFirst){
             
             var listener = gui_popup_h.pop();
             
             
             if (listener != null){
                 if (listener.obj == obj){
                     gui_popup_h.push(listener);
                     return;
                 }
                 if (listener.callback != null)
                     listener.callback();
             }
             if (obj == null) return;

             listener = {
                 obj : obj, callback : callback, showing: false
             };
             
             gui_popup_h.push(listener);
             
             window.onmousedown = function(e) {           
                 var rect;
                 
                 var tmp = [];
                 
                 var item = gui_popup_h.shift();
                    while(item != null){
                        rect = item.obj.getDOMElement().getBoundingClientRect();
                        if (!(e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom)){
                            item.callback();
                        } else tmp.push(item);
                        item.showing = false;
                        item = gui_popup_h.shift(); 
                    }
                    gui_popup_h = tmp;
             }
         },        
        initialize :    function(){
        Class.register("gui/view", GUI.View);   //THE MAIN ANCESTOR WITH THE MOST FUNCTIONS 
        Class.register("gui/container", GUI.Container); // JUST FOR CONTAINERS AND GROUPS, have alignment Orientation
        
        
        //STATIC BASE COMPONENTS
        Class.register("gui/image", GUI.Image);
        Class.register("gui/paragraph", GUI.Paragraph);
        Class.register("gui/text", GUI.Text);
        Class.register("gui/label", GUI.Label);
        Class.register("gui/hover", GUI.Hover);
        
        //INPUT CONTROLS
        Class.register("gui/input", GUI.Input); // ABSTRACT MAIN ANCESTOR
        Class.register("gui/input/checkbox", GUI.Checkbox);
        Class.register("gui/input/text", GUI.TextInput);
        Class.register("gui/input/multilineText", GUI.MultilineText);
        Class.register("gui/input/password", GUI.PasswordInput);
        Class.register("gui/input/date", GUI.DateInput);
        Class.register("gui/input/combo", GUI.ComboInput);
        
        //VIEWERS
        Class.register("gui/svgView",  GUI.SVGView);
        Class.register("gui/webView",  GUI.WebView);
        Class.register("gui/viewport", GUI.Viewport);
        Class.register("gui/embedded", GUI.Embedded);
        //POPUP - screen effects
        Class.register("gui/site", GUI.Site); //POPUP
        
        //BRUSHES FOR PAINT BACKGROUNDS
        Class.register("gui/brush/linearGradient", GUI.Brushes.LinearGradient);
                
        /////////////////////////////////////////
        
        Console.success("GUI "+GUI.version+": initialized");
}
                
};

