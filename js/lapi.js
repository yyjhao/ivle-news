
(function(lapi, store){
    "use strict";

    // using promise ajax
    Deferred.installInto(Zepto);

    var apiKey = "k0z3B5Ng9rhy3MKVAKsGG",
        apiDomain = "https://ivle.nus.edu.sg/",
        apiUrl = apiDomain + "api/lapi.svc/",
        loginURL = apiDomain + "api/login/?apikey=" + apiKey + "&url=" + escape(window.location);

    var onlyChanges = true,
        lastUpdate = store && store.get("token") || 0;

    var parseLocationForToken = function(){
        var match = (/\?token=([^?=\/&]*)/).exec(window.location);
        return match && match[1] || null;
    };

    var token = parseLocationForToken() || (store && store.get("token"));

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

    lapi.login = function(){
        if(!token){
            window.location = loginURL;
        }else{
            store && store.set("token", token);
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
})(window.lapi || (window.lapi = {}), store);
