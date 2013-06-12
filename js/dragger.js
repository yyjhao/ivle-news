
(function(namespace){
    "use strict";

    var dragger = namespace.dragger = {};

    var sx = 0, sy = 0, dragstat = 0, moveEnd = null;

    var mover = null;

    var willClick = false,
        clickDelta = 15;

    var drag = true;

    var defaults = {
        drag: true,
        moving: null
    };

    var options = {
        drag: true,
        moving: null
    };

    var allowClickTimer = 0, scrollElm, scrolling = false;

    $("#main").on("touchmove", function(ev){
        if(!mover)return;
        scrolling = false;
        var t = ev.touches[0],
            dx = t.clientX - sx,
            dy = t.clientY - sy;
        if(dragstat === 1){
            if(Math.abs(dy) > 5){
                dragstat = 2;
                return;
            }else if(Math.abs(dx) > 5){
                dragstat = 3;
                mover.css($.fx.cssPrefix + "transition-duration", "0");
            }
        }
        if(Math.abs(dy) > clickDelta || Math.abs(dx) > clickDelta){
            willClick = false;
        }
        if(options.drag){
            if(dragstat === 3){
                mover.css($.fx.cssPrefix + "transform", "translate3d(" + dx + "px, 0, 0)");
                options.moving && options.moving(dx, dy, mover);
                ev.preventDefault();
            }
        }
    }).on("touchend", function(ev){
        if(dragstat === 3){
            mover.css($.fx.cssPrefix + "transition-duration", "");
        }
        willClick &= (!scrolling);
        var t = ev.changedTouches[0],
            dx = t.clientX - sx,
            dy = t.clientY - sy;
        moveEnd && moveEnd(willClick, dragstat, mover, dx, dy, ev);
        moveEnd = null;
        mover = null;
        dragstat = 0;
    });

    dragger.setScrollElm = function(elm){
        scrollElm = elm;
        elm.on("scroll", function(){
            if(dragstat) dragstat = 2;
            scrolling = true;
        });
    };

    dragger.register = function(x, y, m, fn, prop){
        if(dragstat !== 0)return false;
        mover = m;
        sx = x;
        sy = y;
        dragstat = 1;
        moveEnd = fn;

        prop = prop || defaults;

        for(var i in options){
            if(prop[i] === undefined){
                options[i] = defaults[i];
            }else{
                options[i] = prop[i];
            }
        }

        willClick = true;
        scrolling = false;
    };

    dragger.abandon = function(){
        mover.css($.fx.cssPrefix + "transition-duration", "");
        mover.css($.fx.cssPrefix + "transform", "");
        moveEnd = null;
        mover = null;
        dragstat = 0;
    };

    dragger.touchClick = function(el, ev, cb){
        var t = ev.originalEvent.touches[0],
            sx = t.clientX,
            sy = t.clientY;
        dragger.register(sx, sy, el, function(willClick, dragstat, mover, dx, dy, ev){
            if(willClick){
                ev.preventDefault();
                cb();
            }
        }, {
            drag: false
        });
    };
})(this);