
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

    // Initialize the app
    lapi.login(function(){
        $('body').addClass("notloggedin");
    }).done(function(){
        $('body').removeClass("notloggedin");
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
                        $("a.showall").click();
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
    });
})();