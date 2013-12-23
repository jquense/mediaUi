var View = require('./View')
  , Q = require('q')
  , _ = require('lodash')
  , Region = require('./Region');


module.exports = View.extend( {

    initialize: function(opts){
        View.prototype.initialize.call(this, opts) 
        this._compose(this.children, opts)
    },


    _compose: function(children, options){
        var self = this;

        self.regions = {};
        self.views   = {};

        _.each(children, function(child, name){
            var view = _.isArray(child) ? child : child.view
                , opts = _.extend({}, options, { el: self.$(view[1]) });

            view = self.views[name] = new view[0](opts)

            self.addChildEvents(child.events, view)

            if ( child.region ) self.addToRegion(child.region, view, name)
                
        })
    },

    addChildEvents: function(events, view){
        var self = this;

        if ( !events ) return 

        _.each(events, function(handler, name){
            handler = typeof handler === 'string' ? self[handler] : handler
            view.on(name, handler, self)
        })
    },

    addToRegion: function(region, view, viewName){
        var parts      = region.trim().split(/\s+/)
            , name     = parts.shift()
            , selector = parts.join(' ');
              
        region = this.regions[name];

        if( !region ) 
            region = this.regions[name] = new Region(this.$(selector)[0]);

        region.registerView(view, viewName)
    },

    fetch:  function(){},
    render: function(){},
})
