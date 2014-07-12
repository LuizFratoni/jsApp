
var pdfDoc = {
    
    extends : "gui/viewport",
    
    constructor : function(public, protected, private){
        
        public.createDocument = function(callback){
            var doc;
            if (window.pdfEngineModule == null){
                var script = document.createElement("script");
                  script.async = true;
                script.src = "lib/pdf/jspdf.min.js";
                script.onload = function(){
                    window.pdfEngineModule = true;
                    doc = new jsPDF();
                    callback(doc);
                }
                document.getElementsByTagName("head")[0].appendChild(script);
                return;
            }          
            doc = new jsPDF();
            callback(doc);
        }
        
    }
    
};


pdfDoc;
