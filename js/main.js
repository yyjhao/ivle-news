
(function(){
    // "use strict";

    lapi.login();

    can.route(':filter');
    // Delay routing until we initialized everything
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
    Models.News.findAll({}).done(function (items) {
        new Control('#main', {
            news: items,
            curNews: can.compute(null),
            curNewsInd: can.compute(-1),
            filter: can.route,
            fetcher: dataFetcher
        });
    });

    // Now we can start routing
    can.route.ready(true);
})();