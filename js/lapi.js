
(function(lapi, store){
    "use strict";

    // using promise ajax
    Deferred.installInto(Zepto);

    var apiKey = "k0z3B5Ng9rhy3MKVAKsGG",
        apiDomain = "https://ivle.nus.edu.sg/",
        apiUrl = apiDomain + "api/lapi.svc/",
        loginURL = apiDomain + "api/login/?apikey=" + apiKey;
    if(!isCordova) loginURL += "&url=" + escape(window.location + "#callback");

    var onlyChanges = true,
        lastUpdate = store && store.get("token") || 0;

    var parseLocationForToken = function(l){
        var match = (/\?token=([^?=\/&]*)/).exec(l);
        return match && match[1] || null;
    };

    var token = store && store.get("token");
    if(token === "") token = null;

    var getService = function(service, property){
        // note that sometimes the api use AuthToken
        var tokenParam = property ? "AuthToken" : "Token";
        var url = apiUrl + service + "?output=json&callback=?&APIKey=" + apiKey + "&" + tokenParam + "=" + token;
        if(property){
            for(var k in property){
                url += "&" + k + "=" + escape(property[k]);
            }
        }
        return $.getJSON(url);
    };

    lapi.login = function(iframe, fn){
        if(!token){
            fn();
            var w = iframe,
                defer = $.Deferred();
            w.src = loginURL;
            if(isCordova){
                w.onload = function(){
                    var str = w.contentDocument.body.innerHTML;
                    if(str.indexOf("<") === -1){
                        token = str;
                        store && store.set("token", token);
                        defer.resolve();
                    }
                };
            }else{
                w.onload = function(){
                    if(w.contentDocument){
                        token = parseLocationForToken(w.contentDocument.location.href);
                        store && store.set("token", token);
                        defer.resolve();
                    }
                };
            }
            return defer;
        }else{
            store && store.set("token", token);
            return $.Deferred().resolve();
        }
    };

    lapi.validate = function(){
        return getService("Validate");
    };

    lapi.getUserName = function(){
        return getService("UserName_Get");
    };

    lapi.getUserId = function(){
        return getService("UserID_Get");
    };

    lapi.getModules = function(duration){
        return getService("Modules", {
            Duration: duration || 0,
            IncludeAllInfo: 'true'
        });
    };

    lapi.getEvents = function(){
        return getService("StudentEvents", {
            TitleOnly: false
        });
    };

    lapi.getNews = function(){
        return getService("PublicNews", {
            TitleOnly: false
        });
    };

    lapi.getTimeTable = function(){
        return getService("Timetable_Student", {
            AcadYear: "2012/2013"
        });
    };

    lapi.clearToken = function(){
        store.set("token", "");
        token = null;
    };
})(window.lapi || (window.lapi = {}), store);
