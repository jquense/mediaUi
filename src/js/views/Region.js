var Backbone = require('backbone')
  , Q = require('q')
  , _ = require('lodash')


function Region(el){
    this.currentView = null;
    this.el          = el

    if ( !this.el ) throw new Error("Regions require an element")

    this._views = {};
    this.$el    = $(el)
}

Region.prototype = {

    $: function(selector){
        return this.$el.find(selector);    
    },

    registerView: function(view, name){
        this._views[name] = view;
    },

    unregisterView: function(name){
        delete this._views[name];   
    },

    close: function(){
        var view = this.currentView;

        if ( !view ) return; 
        if ( view.close )  view.close(); 

        this.currentView = null;
    },

    openView: function(view, reqOpts){
        view = this._views[view]

        if ( view !== this.currentView ){
            this.currentView && this.currentView.close()
            this.$el.empty().append(view.el)
            this.currentView = view;
        }

        view.open(reqOpts)
    },
    
}

module.exports = Region;