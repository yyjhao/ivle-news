
(function(namespace){
    "use strict";

    var dragger = namespace.dragger = {};

    var sx = 0, sy = 0, dragstat = 0, moveEnd = null;

    var mover = null;

    var drag = true;

    var defaults = {
        drag: true,
        moving: null
    };

    var options = {
        drag: true,
        moving: null
    };

    $("#main").on("touchmove", function(ev){
        if(!mover)return;
        var t = ev.changedTouches[0],
            dx = t.clientX - sx,
            dy = t.clientY - sy;
        if(dragstat === 1 && options.drag){
            if(Math.abs(dy) > 10){
                dragstat = 2;
                return;
            }else if(Math.abs(dx) > 13){
                dragstat = 3;
            }
        }
        mover.css($.fx.cssPrefix + "transition-duration", "0");
        if(dragstat === 3){
            mover.animate({
                translate3d: dx + "px, 0, 0"
            }, 0);
            options.moving && options.moving(dx, dy, mover);
            ev.preventDefault();
        }
    });

    $("#main").on("touchend", function(ev){
        var moved = dragstat === 3 || dragstat === 2;
        if(dragstat === 3){
            mover.css($.fx.cssPrefix + "transition-duration", "");
        }
        dragstat = 0;
        var t = ev.changedTouches[0],
            dx = t.clientX - sx,
            dy = t.clientY - sy;
        moveEnd && moveEnd(moved, mover, dx, dy);
        moveEnd = null;
        mover = null;
    });

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
    };

    dragger.touchClick = function(el, ev, cb){
        var t = ev.originalEvent.changedTouches[0],
            sx = t.clientX,
            sy = t.clientY;
        dragger.register(sx, sy, el, function(moved){
            if(!moved){
                cb();
            }
        }, {
            drag: false
        });
    };
})(this);