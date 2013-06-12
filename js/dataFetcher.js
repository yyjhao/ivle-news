
(function(namespace, lapi, store){
    "use strict";

    var fetcher = namespace.dataFetcher = {};

    var fetched = store.get("fetched") || {},
        lastFetched = parseInt(store.get("last"), 10) || 0,
        username = store.get("username"),
        userId = store.get("userid");

    var buildEventsContent = function(event){
        return "<p>" + [
            "<b>Agenda:</b>" + event.Agenda,
            "<b>Date:</b>" + event.EventDateTime,
            "<b>Price: </b>" + event.Price,
            "<b>Venue: </b>" + event.Venue,
            "<b>Organizer: </b>" + event.Organizer,
            "<b>Contact: </b>" + event.Contact,
            event.Description
        ].join("</p>\n<p>") + "</p>";
    };

    fetcher.getUserName = function(callback){
        if(username){
            callback(username);
        }else{
            lapi.getUserName().done(function(data){
                username = data;
                username = username.split(" ").map(function(s){
                    return s.charAt(0) + s.slice(1).toLowerCase();
                }).join(" ");
                store.set("username", username);
                callback(username);
            });
        }
    };

    fetcher.check = function(){
        var defer = $.Deferred();
        lapi.validate().done(function(data){
            if(data.Success){
                lapi.getUserId().done(function(data){
                    if(data != userId){
                        Models.News.destoryAll();
                        store.set("fetched", {});
                        store.set("last", 0);
                        userId = data;
                        store.set("userid", userId);
                        username = null;
                    }
                    dataFetcher.getUserName(function(username){
                        defer.resolve(username);
                    });
                });
            }else{
                defer.reject({
                    type: 1,
                    str: "Login expired"
                });
            }
        }).fail(function(){
            defer.reject({
                type: 0,
                str: "No network connection."
            });
        });
        return defer.promise();
    };

    fetcher.logout = function(){
        localStorage.clear();
        location.hash = "";
        location.reload();
    };

    fetcher.fetch = function(){
        var d = new Deferred();

        Deferred.when(lapi.getNews(), lapi.getEvents(), lapi.getModules(Math.ceil((Date.now() - lastFetched) / 60000)))
        .then(function(news, newsuc, newsobj, events, eventssuc, eventsobj, modules){
            lastFetched = Date.now();
            store.set("last", lastFetched);
            var latestDate = null;
            var result = [];
            news.Results.forEach(function(r){
                var id = "news-" + r.ID;
                if(!fetched[id]){
                    fetched[id] = true;
                    var date = new Date(r.CreatedDate_js);
                    result.push({
                        title: r.Title,
                        from: "IVLE",
                        content: r.Description,
                        date: date,
                        starred: false,
                        read: false
                    });
                    if(!latestDate || latestDate < date){
                        latestDate = date;
                    }
                }
            });
            modules.Results.forEach(function(m){
                var code = m.CourseCode;
                m.Announcements.forEach(function(a){
                    var id = code + "-" + a.ID;
                    if(!fetched[id]){
                        fetched[id] = true;
                        var date = new Date(a.CreatedDate_js);
                        result.push({
                            title: a.Title,
                            from: code,
                            content: a.Description,
                            date: date,
                            read: a.isRead,
                            starred: false
                        });
                        if(!a.isRead){
                            if(!latestDate || latestDate < date){
                                latestDate = date;
                            }
                        }
                    }
                });
            });
            if(!latestDate){
                latestDate = new Date();
            }else{
                latestDate = new Date(latestDate.getTime() - 1000);
            }
            events.Results.forEach(function(e){
                var id = "events-" + e.ID;
                if(!fetched[id]){
                    fetched[id] = true;
                    result.push({
                        title: e.Title,
                        from: "Events",
                        content: buildEventsContent(e),
                        date: latestDate,
                        starred: false,
                        read: false
                    });
                }
            });
            d.resolve(result);
            store.set("fetched", fetched);
        });
        return d.promise();
    };
})(this, lapi, store);