
(function(){
    // "use strict";

    can.route(':filter');
    can.route.ready(false);

    if((window.location + "").indexOf("callback") != -1){
        $("body").hide();
        return;
    }

    var addTutorial = function(){
        [{
            title: "Swipe right to star/unstar",
            from: "Tutorials",
            content: "Swipe the big title right to go back. Tap the star to star/unstar.",
            date: new Date(),
            starred: false,
            read: false
        },{
            title: "Swipe left to delete",
            from: "Tutorials",
            content: "Swipe the big title right to go back. Tap the star to star/unstar.",
            date: new Date(),
            starred: false,
            read: false
        },{
            title: "Tap to view",
            from: "Tutorials",
            content: "Swipe the big title right to go back. Tap the star to star/unstar.",
            date: new Date(),
            starred: false,
            read: false
        },{
            title: "Slide down to refresh",
            from: "Tutorials",
            content: "Swipe the big title right to go back. Tap the star to star/unstar.",
            date: new Date(),
            starred: false,
            read: false
        }].forEach(function(c){
            Models.News.create(c);
        });
    };

    var init = function(){
        lapi.login($("#login iframe")[0], function(){
            $('body').addClass("notloggedin");
        }).done(function(){
            $('body').removeClass("notloggedin");
            dataFetcher.check().done(function(username, network, isNew){
                if(!network){
                    alert("Network connection is down.");
                }
                if(isNew){
                    addTutorial();
                }
                Models.News.findAll({}).done(function (items) {
                    var control = new Control('#main', {
                        news: items,
                        curNews: can.compute(null),
                        curNewsInd: can.compute(-1),
                        filter: can.route,
                        fetcher: dataFetcher,
                        username: can.compute(username)
                    });
                    $("a.showall").click();
                    if(!isNew && network){
                        control.options.refreshStatus(2);
                    }
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