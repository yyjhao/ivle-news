(function (namespace) {
    'use strict';

    var News = can.Model.LocalStorage({
        storageName: 'yj.ivle.news',
        query: can.compute(null)
    }, {
        init: function(prop){
            if(prop.date) this.attr("date", new Date(prop.date));
        },

        matchQuery: function(){
            var query = News.query();
            if(!query)return true;
            return this.attr("title").indexOf(query) !== -1 ||
                    this.attr("from").indexOf(query) !== -1;
        },

        matches : function () {
            var filter = can.route.attr('filter');
            return (!filter || (filter === 'onlyStarred' && this.attr('starred')))
                    && this.matchQuery();
        },

        getFriendlyDate: function(){
            return moment(this.attr("date")).fromNow();
        },

        getDetailedDate: function(){
            return moment(this.attr("date")).calendar();
        }
    });

    // List for Todos
    News.List = can.Model.List({
        unread: function () {
            var unread = 0;

            this.each(function (news) {
                unread += news.attr('read') ? 0 : 1;
            });

            return unread;
        },

        countMatches: function(){
            var matches = 0;

            this.each(function (news) {
                matches += news.matches() ? 1 : 0;
            });

            return matches;
        },

        sort: function(cmp){
            var arr = [];
            this.each(function(val){
                arr.push(val);
            });
            arr.sort(cmp);
            this.replace(arr);
            can.Model.LocalStorage.updateAll(arr);
        }
    });

    namespace.Models = namespace.Models || {};
    namespace.Models.News = News;
})(this);
