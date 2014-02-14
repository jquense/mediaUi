var View = require('./View')
  , Q = require('q')
  , _ = require('lodash')
  , Region = require('./Region');


module.exports = View.extend( {

    initialize: function(opts){
        View.prototype.initialize.call(this, opts) 

        this._options = opts
        this._regions(this.children, opts)
        this.render();
    },

    addChildEvents: function(events, view){
        var self = this;

        if ( !events ) return 

        _.each(events, function(handler, name){
            handler = typeof handler === 'string' ? self[handler] : handler
            view.on(name, handler, self)
        })
    },

    addToRegion: function(region, view, viewName, opts){
        var parts    = region.trim().split(/\s+/)
          , regName  = parts.shift()
          , selector = parts.join(' ');
              
        region = this.regions[regName];

        if( !region ) 
            region = this.regions[regName] = new Region(this.$(selector)[0]);

        region.registerView(viewName, view, opts);
    },

    fetch:  function(){},

    render: function(){
        var self = this
          , children = this.children
          , options = _.clone(this._options);

        self.views = {};
        //self.$el.empty();

        _.each(children, function(child, name){
            var view = _.isArray(child) ? child : child.view
              , ctor = _.isFunction(view) ? view : view[0]
              , opts = _.extend(options, { el: view[1] && self.$(view[1]) });

            if ( child.region) return;

            view = self.views[name] = new ctor(opts);

            self.addChildEvents(child.events, view)  
        })
    },

    _regions: function(children, opts){
        var self = this
          , options = _.clone(opts);

        delete options.el;

        self.regions = {};

        _.each(children, function(child, name){
            var view = _.isArray(child) ? child : child.view
              , ctor = _.isFunction(view) ? view : view[0];

            if ( child.region ) 
                self.addToRegion(child.region, ctor, name, options)
        })
    }
})
