"use strict";

var Backbone = require('backbone')
  , _ = require('lodash');


var ownOpts = ['view', 'routes', 'el', 'connection']

function AppArea(options){
    this._configure(options)
    this._setElement()
    this._setView()
    this._setRouter()

    this.initialize.apply(this, arguments);
}

 _.extend(AppArea.prototype, Backbone.Events, { 
      
    initialize: function(){},

    start: function() {
        var self = this;
        
        return this.view.render();
    },

    $: function(selector) {
        return this.$el.find(selector);
    },      

    onRoute: function(route, fn){
        var self = this;

        self.router.on("route:"+ route, fn, self)
    },

    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      
      _.extend(this, _.pick(options, ownOpts));

      
      this.options = options;
    },

    _setElement: function() {
      var el = _.result(this, 'el')

      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    _setRouter: function() {
      this.router = new Backbone.Router(this.routes)
    },

    _setView: function() {
        this.view = typeof this.view === 'function' 
            ? new this.view(this.options)
            : view
    }

})

AppArea.define = Backbone.Model.extend

module.exports = AppArea;