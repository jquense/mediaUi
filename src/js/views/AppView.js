var Backbone = require('backbone')
  , CompositeView = require('./CompositeView')
  , Q = require('q')
  , _ = require('lodash')
  , utils = require('../utilities')

module.exports = CompositeView.extend({
    
    constructor: function(options){
        CompositeView.call(this, options);
        this._routes();
    },

    _routes: function(){
        var self = this
          , router = new Backbone.Router({ routes: self.routes })

        self.router = router;

        self.$el.on("click", "a[data-link=client]", function(e){
            var behaviour = e.target.getAttribute("data-behave")
              , href = e.target.getAttribute("href");

            e.preventDefault();
            e.stopPropagation();

            if (behaviour === 'append') 
                href = location.pathname + href

            //history.pushState({}, '', href)  
            router.navigate(href, true)  
        })
          
        router.on("route", function(route, params){
            var handle = utils.get(self, route)
              , context = utils.get(self, route.substring(0,route.lastIndexOf("."))) || self

            handle.apply(context, params)
        })    
    }
})