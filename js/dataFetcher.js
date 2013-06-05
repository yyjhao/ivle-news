
(function(namespace, lapi, store){
    var fetcher = namespace.dataFetcher = {};

    var fetched = store.get("fetched") || {},
        lastFetched = parseInt(store.get("last"), 10) || 0;

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

    fetcher.fetch = function(){
        var d = new Deferred();

        Deferred.when(lapi.getNews(), lapi.getEvents(), lapi.getModules(Math.round((Date.now() - lastFetched) / 60000)))
        .then(function(news, newsuc, newsobj, events, eventssuc, eventsobj, modules){
            lastFetched = Date.now();
            store.set("last", lastFetched);
            console.log(news, events, modules);
            var result = [];
            news.Results.forEach(function(r){
                var id = "news-" + r.ID;
                if(!fetched[id]){
                    fetched[id] = true;
                    result.push({
                        title: r.Title,
                        from: "IVLE",
                        content: r.Description,
                        date: new Date(r.CreatedDate_js),
                        starred: false,
                        read: false
                    });
                }
            });
            events.Results.forEach(function(e){
                var id = "events-" + e.ID;
                if(!fetched[id]){
                    fetched[id] = true;
                    result.push({
                        title: e.Title,
                        from: "Events",
                        content: buildEventsContent(e),
                        date: (new Date()),
                        starred: false,
                        read: false
                    });
                }
            });
            modules.Results.forEach(function(m){
                var code = m.CourseCode;
                m.Announcements.forEach(function(a){
                    var id = code + "-" + a.ID;
                    if(!fetched[id]){
                        fetched[id] = true;
                        result.push({
                            title: a.Title,
                            from: code,
                            content: a.Description,
                            date: new Date(a.CreatedDate_js),
                            read: a.isRead,
                            starred: false
                        });
                    }
                });
            });
            d.resolve(result);
            store.set("fetched", fetched);
        });
        return d.promise();
    };
})(this, lapi, store);