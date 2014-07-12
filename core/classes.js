
/*
 *  JavaScript Class Foundation (classes.js)
 *      Web Distributed(On-line) Object Oriented JavaScript Foundation
 *  Created by Luiz Fratoni (luizfratoni@gmail.com)
 *  Creation Date: 01/04/2014
 *  
 *  TODO:
 *  2. Enable INTERFACE class Attribute, to allow IDE's list the Object Methods and Properties
 *  
*/



var ClassFoundationVersion = "0.2.0.10";

window.onerror = function(err, file, line){
                    if (Console == null) alert("[CODE ERROR] file: '"+file+"' - line : "+line+" - error :"+err);
                    else Console.error("[CODE ERROR] file: '"+file+"' - line : "+line+" - error :"+err);
}    
//////////////////////////////////////////////////////////////////////////////////////////////////////

function TRACE(x){ Console.write(x); }


var Bundle = {
    
    version : ClassFoundationVersion,
    implementation : function(public, protected, private) {

        if (protected.base == null){
            protected.base = new ClassLoader();
        }
        protected.classes = [];
        protected.ref = 1;
        
        public.release = function(){
            protected.ref--;
            if (protected.ref <= 0){
                protected.classes = [];
                public.manager.remove(public);
            }
        }
        
        public.addRef = function(){
            protected.ref++;
        }
        
        ///////////////////////////////////////////
        
        public.fromName = function(uri){
            var cls = protected.classes[uri];
            if (cls == null){
                cls = protected.base.fromName(uri);
                if (cls == null) return null;
            }
            
            if (cls.createInstance == null){
                cls.createInstance = function(obj){
                    return public.createInstance(cls, obj);
                }
            }
            
            return cls;
        }
        
        public.loadInheritance = function(uri, instance, protected){
            var cls;
            if (uri.constructor == String){
                cls = public.fromName(uri);
                if (cls == null){
                    throw "Base Class '"+uri+" not found";
                }
            }
            
            if (cls.extends != null){
                public.loadInheritance(cls.extends, instance, protected);
            }
            
            try{
                cls.implementation(instance, protected, {});   
            } catch(err){
                throw "Script Error on Base Class '"+uri+"' not found";
            }
        }
        
        public.createInstance = function(uri, attr){

                var instance = {};
                var protected = {};
                var aux;
                if (uri.constructor == String){
                    
                    var cls = public.fromName(uri);
                    if (cls == null)
                            throw Console.error("Class '"+uri+"' not found");
 
                }else 
                    cls = uri;
                
            try{
                 instance.class = uri;
                 if (cls.extends != null)
                    public.loadInheritance(cls.extends, instance, protected);

                cls.implementation(instance, protected, {});
                    
            } catch (err){
                throw Console.error("Class Error '"+uri+'": '+err);
            }       
            
            if (attr != null)
                Class.applyProperties(instance, attr);
            return instance;
            
        }
        
        public.load = function(cls){
            if (cls.constructor == String){
                var c = public.fromName(cls);
                protected.classes[cls] = c;
            }
            else {
                var uri;
                for (var i = 0; i < cls.length; i++){
                    uri = cls[i];
                    var c = Class.fromName(uri);
                    protected.classes[uri] = c;
                }
            }
        }
        
        public.register = function(uri, cls){
            Console.write("Registering '"+uri+"'");
            protected.classes[uri]= cls;
        }
        
        public.extends = function(uri, instance, shared){
            var cls = public.fromName(uri);
            if (cls == null){
                Console.error("Class Error: Can't Inherit "+uri);
                return false;
            }
            if (cls.extends != null)
                public.loadInheritance(cls.extends, instance, shared);
            cls.implementation(instance, shared);
            return true;
        } 
    
    }
}



function ClassImpl(public, protected, private){    
    Bundle.implementation(public, protected, private);
    protected.classPath = "";
    public.setClassPath = function(path){
            if (path == null){
                protected.setclassPath = "";
                return;
            }
        
            if (path.charAt(path.length-1) != '/')
                protected.classPath = path+"/";
            else protected.classPath = path;
    }
    
    public.fromName = function(uri){
        var cls = protected.classes[uri];
        if (cls == null){
            var loader = new ClassLoader(protected.classPath+uri);
            cls = loader.do();
            if (cls == null){
                return null;
            }
        }
        
        if (cls.createInstance == null){
                cls.createInstance = function(obj){
                    return public.createInstance(cls, obj);
                }
         }
        
        return cls;
    }
    
    public.applyProperties = function(obj, props){
       for (var prop in props){
           try{
                obj["set"+prop](props[prop]);
           } catch(err){
               Console.error("Property '"+prop+"' doesn't exists");
           }
       }      
    }    


}

var Class = {}; 
ClassImpl(Class, {}, {});





//////////////////////////////////////////////////////////////////


function ClassLoader(uri){
    
    var self = this;
    
    this.onload = null;
    this.onerror = null;
     
    
    
    
    /////////////////////
    

      function fail(str){             
              Console.error(err);
              if (self.onerror != null) self.onerror(err);
              return 0;
      }
      
      this.start = function(){
            run(true);
      }
      
      this.do = function(){
          return run(false);
      }
      
      function run(async){
          var url = uri+".js";
          
          
          var reqJs = new XMLHttpRequest() 
          
          reqJs.open("GET", url, async);
            reqJs.setRequestHeader("Cache-Control", "no cache");

          if (async){
               reqJs.onload = function() { receiveJs(reqJs); } 
               reqJs.send(null); 
           } else{
               reqJs.send(null);
               return receiveJs(reqJs);               
           }                               
      }
      
      function receiveJs(reqJs){
              try {
                    instance = eval(reqJs.responseText);   
                    if (instance.version != null){
                        Console.write("Class Loaded: '"+uri+"' - "+instance.version);
                    } else{
                        Console.write("Class Loaded: '"+uri+"'");
                    }
                    if (self.onload != null) self.onload(instance)
                    return instance;                  
                    
               } catch(err){
                     var e = "[ERROR] ClassLoader ("+uri+"): - Error parsing Class Script: "+err;
                     Console.error(e);
                     Console.error(this.responseText);
                     if (self.onerror != null) self.onerror(e);
                     return null;
               }
           
          
      }
    
 }
             

/////////////////////////////////////////////////////////////////////////////////

function Runnable(uri){
    
    var classLoader = new ClassLoader(uri);
    
    this.run = function(){
        classLoader.onload = function(cls){
            var instance = {};
            cls.implementation(instance, {});            
            instance.run();
        }
        classLoader.start();
    }   

}


////////////////////////////////////////////////////////////////////////////////

var Console = {

    wnd : null,
    view  : null,
            
    noconsole : function(){
	wnd = null;
	view = null;
    },

    initialize : function(defaulWnd){
        if (defaulWnd == false || defaulWnd == null){     
            wnd = window.open("", "ConsoleWindow", "width=700; height=300; title='Console Output';");            
        }
        else 
            wnd = window;
        if (wnd == null){
            view = null;
            return;
        }
        
        var toolbar = wnd.document.createElement("div");
        toolbar.style.cssText = "background-color: #cccccc; position: fixed; left: 0px; top: 0px; right: 0px; height: 30px;";
        wnd.document.body.appendChild(toolbar);
        view = wnd.document.createElement("div");
        
        var button = wnd.document.createElement("input");
        button.type = "button";
        button.value = "Clear";
        button.onclick = function(){
            view.innerHTML = "";
        }
        toolbar.appendChild(button);
        
        view.style.cssText = "position: fixed; overflow-y: scroll; background-color: black; color: #00FF00; left: 0px; top: 30px; right: 0px; bottom: 0px; padding: 8px;";
        wnd.document.body.appendChild(view);
        wnd.document.title = "Console Output";
        
        var firstNode = document.createElement("div");
        
        firstNode.innerHTML = "Class Foundation v"+Environment.version+" initialized";
        firstNode.style.color = "#f0fff0";
        firstNode.style.border= "1px solid #f0fff0";
        firstNode.style.backgroundColor = "#505050";
        firstNode.style.padding = 8;
        view.appendChild(firstNode);
    },

    write : function(txt){
	 if (view == null) return;
         var div = document.createElement("div");
        // div.appendChild(document.createTextNode(txt));
	 div.innerHTML = txt;
         view.appendChild(div);
         view.scrollTop = view.scrollHeight;
    } ,

    error : function(txt){
	 if (view == null) return;
         var div = document.createElement("div");
         div.style.cssText = "color: #EE0000";
         div.appendChild(document.createTextNode(txt));
         view.appendChild(div);
         view.scrollTop = view.scrollHeight;
         return txt;
    },

    alert : function(txt){
	 if (view == null) return;
         var div = document.createElement("div");
         div.className = "consoleAlert";
         div.style.cssText = "color: #EEEE00";
         div.appendChild(document.createTextNode(txt));
         view.appendChild(div);
         view.scrollTop = view.scrollHeight;
    },
            
    success : function(txt){
	 if (view == null) return;
         var div = document.createElement("div");
         div.className = "consoleAlert";
         div.style.cssText = "color: #cccccc; background-color: #202020; border: 1px solid #909090;";
         div.appendChild(document.createTextNode(txt));
         view.appendChild(div);
         view.scrollTop = view.scrollHeight;
    },

    setHeight : function(h){
	 if (view == null) return;
	view.style.height = h;
    },

    setVisible : function(b){
	if (view == null) return;
	if (b == true) view.style.display = "block";
	else view.style.display = "none";
    },

    maximize : function(x,y,w,h){
	view.style.height = "auto";
	view.style.left  = x;
	view.style.top  = y;
	view.style.right  = w;
	view.style.bottom  = h;
    }

};

var console = Console;
var Strings = {};
var Environment = {
    version : ClassFoundationVersion,
    implements : {},        
};


function NEW(f){
    var obj = {};
    f(obj, {},{}); 
    return obj;
}

function New(f, params){
    
    
        var obj = Class.createInstance(f);    
    
    if (params != null){
            try{
                Class.applyProperties(obj, params);
            } catch (err){
                Console.error("ERROR Settings Parameters to "+err);
            }
    }
    return obj;
}

