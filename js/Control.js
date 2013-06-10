
(function(namespace){
    'use strict';

    var Control = namespace.Control = can.Control({
        defaults: {
            view: 'mainview',
            refreshStatus: can.compute(0),
            _wasFixed: false,
            _fixedElm: null
        }
    }, {
        init: function(){
            this.element.append(can.view(this.options.view, this.options));
            dragger.setScrollElm($(".mainscroll"));
        },

        '{curNews} change': function(val, ev){
            var elm = $(".perItem.current .mainarea")[0];
            if(elm){
                elm.scrollTop = 0;
            }
            if(val()){
                val().attr("read", true);
                val().save();
                if(!ev.data[1]){
                    $(".perItem").css("-webkit-transition", "none");
                    this.options._wasFixed = true;
                } else if(this.options._wasFixed){
                    $(".perItem").css("-webkit-transition", "");
                    this.options.wasFixed = false;
                }
                if(this.options._fixedElm){
                    this.options._fixedElm.css("-webkit-transform", "");
                    this.options._fixedElm = null;
                }
            }else{
                this.options._fixedElm = $(".perItem.current").css("-webkit-transform", "translate3d(0, 0, 0)");
            }
        },

        '.mainscroll touchend': function(el, ev){
            if(this.options.refreshStatus() == 1){
                this.options.refreshStatus(2);
            }
        },

        '{refreshStatus} change': function(val){
            if(val() === 2){
                this.options.fetcher.fetch().done(function(news){
                    this.options.refreshStatus(0);
                    news.forEach(function(n){
                        var nn = new Models.News(n);
                        nn.save();
                        this.options.news.push(nn);
                    }.bind(this));
                    $(".showall").click();
                    this.options.news.sort(function(a, b){
                        return b.attr("date") - a.attr("date");
                    });
                }.bind(this));
            }
        },

        '.mainscroll touchstart': function(el, ev){
            // copied from https://github.com/joelambert/ScrollFix
            var event = ev.originalEvent, elem = el[0];
            var startY = event.touches[0].pageY,
                startTopScroll = elem.scrollTop;

            if(startTopScroll <= 0) elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
        },

        '.mainscroll touchmove': function(el, ev){
            if(this.options.refreshStatus() === 2)return;
            if(el[0].scrollTop < -70){
                this.options.refreshStatus(1);
            }else{
                this.options.refreshStatus(0);
            }
        },

        'footer touchstart': function(el, ev){
            ev.preventDefault();
        },

        '.star touchstart': function(el, ev){
            dragger.touchClick(el, ev, function(){
                var n = this.options.curNews();
                if(!n)return;
                var starred = n.attr("starred");
                n.attr("starred", !starred);
                n.save();
            }.bind(this), {
                drag: null
            });
        },

        '.bottombar a click': function(el){
            el.addClass("current");
        },

        '.newsItem touchstart': function(el, ev){
            var t = ev.originalEvent.changedTouches[0],
                sx = t.clientX,
                sy = t.clientY;
            dragger.register(sx, sy, el, function(willClick, dragstat, mover, dx, dy){
                if(willClick){
                    this.options.curNews(el.data('info'));
                    this.options.curNewsInd(this.options.news.indexOf(this.options.curNews()));
                    mover.animate({
                        translate3d: "0, 0, 0"
                    }, {
                        duration: 200
                    }).removeClass("toStar").removeClass("toRemove");
                }else if(dragstat === 3){
                    if(dx < -200){
                        mover.animate({
                            translate3d: "-100%, 0, 0",
                            height: "0"
                        },{
                            duration: 200,
                            complete: function(){
                                el.data("info").destroy();
                            }
                        }).removeClass("toStar").removeClass("toRemove");
                    }else{
                        if(dx > 150){
                            var n = el.data("info");
                            n.attr("starred", !n.attr("starred"));
                        }
                        mover.animate({
                            translate3d: "0, 0, 0"
                        }, {
                            duration: 200
                        }).removeClass("toStar").removeClass("toRemove");
                    }
                }
            }.bind(this), {
                moving: function(dx, dy, mover){
                    if(dx < -195){
                        mover.addClass("toRemove");
                    }else{
                        mover.removeClass("toRemove");
                    }

                    if(dx > 150){
                        mover.addClass("toStar");
                    }else{
                        mover.removeClass("toStar");
                    }
                }
            });
        },

        ".next touchstart": function(el, ev){
            if(!el.hasClass("disabled")){
                dragger.touchClick(el, ev, function(){
                    this.options.curNewsInd(this.options.curNewsInd() + 1);
                    this.options.curNews(this.options.news.attr(this.options.curNewsInd()));
                }.bind(this));
            }
        },

        ".previous touchstart": function(el, ev){
            if(!el.hasClass("disabled")){
                dragger.touchClick(el, ev, function(){
                    this.options.curNewsInd(this.options.curNewsInd() - 1);
                    this.options.curNews(this.options.news.attr(this.options.curNewsInd()));
                }.bind(this));
            }
        },

        'a touchstart': function(el, ev){
            dragger.touchClick(el, ev, function(){
                el.click();
            });
        },

        '.mainarea touchstart': function(el, ev){
            // copied from https://github.com/joelambert/ScrollFix
            var event = ev.originalEvent, elem = el[0];
            var startY = event.touches[0].pageY,
                startTopScroll = elem.scrollTop;

            if(startTopScroll <= 0) elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
        },

        'header touchstart': function(el, ev){
            var t = ev.originalEvent.changedTouches[0],
                sx = t.clientX,
                sy = t.clientY;
            var mover = $('#main');
            dragger.register(sx, sy, mover, function(willClick, dragstat, mover, dx, dy){
                if(dx > 100){
                    this.options.curNews(null);
                }
                mover.css($.fx.cssPrefix + "transition-duration", "");
                mover.css($.fx.cssPrefix + "transform", "");
            }.bind(this));
        },

        'input search': function(el, ev){
            Models.News.query(el.val());
        }
    });

})(this);