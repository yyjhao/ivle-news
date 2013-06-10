
(function(){
    // "use strict";

    can.route(':filter');
    can.route.ready(false);

    // Models.News.create({
    //     title: "A title eh",
    //     from: "Event",
    //     content: "<ul><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li><li>eh</li></ul>",
    //     date: new Date(),
    //     starred: true,
    //     read: false
    // });

    // Initialize the app
    lapi.login();

    lapi.validate().done(function(data){
        if(data.Success){
            dataFetcher.getUserName(function(username){
                Models.News.findAll({}).done(function (items) {
                    new Control('#main', {
                        news: items,
                        curNews: can.compute(null),
                        curNewsInd: can.compute(-1),
                        filter: can.route,
                        fetcher: dataFetcher,
                        username: can.compute(username)
                    });
                });
                can.route.ready(true);
            });
        }else{
            alert("need to relogin");
            dataFetcher.relogin();
        }
    }).fail(function(){
        alert("network problem bro");
        location.reload();
    });
})();