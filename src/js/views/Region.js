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

function CurrentView(name, view){
    this.name = name;
    this.view = view;    
}

CurrentView.prototype.close = function(){ this.view.close && this.view.close(); }
CurrentView.prototype.open  = function(o){ this.view.open && this.view.open(o); }

Region.prototype = {

    $: function(selector){
        return this.$el.find(selector);    
    },

    registerView: function(name, ctor, options ){
        this._views[name] = [ctor, options] ;
    },

    unregisterView: function(name){
        delete this._views[name];   
    },

    close: function(){
        var current = this.currentView;

        if ( !current  ) return; 
        
        current.close(); 

        this.currentView = null;
    },

    openView: function(name, reqOpts){
        var view = this._views[name][0]
          , options = this._views[name][1]
          , current = this.currentView ;

        if ( !this.currentView || name !== this.currentView.name ){
            current && current.close()
            current = new CurrentView(name, new view(options) );

            this.show(current.view);
            current.open(reqOpts)

            this.currentView = current;
        }
    },

    show: function(view){
        this.$el.empty().append(view.el);
    }
    
}

module.exports = Region;