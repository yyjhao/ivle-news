
(function(store){
    "use strict";

    var namespace = "yyj.ivle.";

    store.get = function(name){
        var str = localStorage.getItem(namespace + name);
        if(str != "undefined") return JSON.parse(str);
        else return null;
    };

    store.set = function(name, val){
        return localStorage.setItem(namespace + name, JSON.stringify(val));
    };
})(window.store || (window.store = {}));