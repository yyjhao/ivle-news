
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
    if((window.location + "").indexOf("callback") != -1){
        $("body").hide();
        return;
    }

    var init = function(){
        lapi.login($("#login iframe")[0], function(){
            $('body').addClass("notloggedin");
        }).done(function(){
            $('body').removeClass("notloggedin");
            dataFetcher.check().done(function(username, network){
                if(!network){
                    alert("Network connection is down.");
                }
                Models.News.findAll({}).done(function (items) {
                    new Control('#main', {
                        news: items,
                        curNews: can.compute(null),
                        curNewsInd: can.compute(-1),
                        filter: can.route,
                        fetcher: dataFetcher,
                        username: can.compute(username)
                    });
                    $("a.showall").click();
                });
                can.route.ready(true);
            }).fail(function(error){
                if(error.type === 1){
                    loginExpired();
                }
            });
        });
    };

    window.loginExpired = function(){
        alert("Login expired, please login again.");
        lapi.clearToken();
        init();
    };

    init();
})();