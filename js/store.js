
(function(store){
    "use strict";

    var namespace = "yyj.ivle.";

    store.get = function(name){
        return JSON.parse(localStorage.getItem(namespace + name));
    };

    store.set = function(name, val){
        return localStorage.setItem(namespace + name, JSON.stringify(val));
    };
})(window.store || (window.store = {}));