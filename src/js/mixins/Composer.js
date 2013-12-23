var Backbone = require('backbone')
  
  , _ = require('lodash')

function Composer(children, options){
    this.compose(children, options)
}

Composer.prototype = {
    compose: function(children, options){
        var self = this;

        self.views = {};

        _.each(children, function(child, name){
            var view = _.isArray(child) ? child : child.view
              , opts = {}

            if ( !view && child.views) 
                self.views[name] = new self.constructor(child, options);
            else{
                opts = _.extend({}, options, { el: self.$(view[1]) });
                view = self.views[name] = new view[0](opts)
                self._addChildEvents(child.events, view)
            } 
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
}

Composer.extend = Backbone.Model.extend

module.exports = Composer