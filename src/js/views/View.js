'use strict';
var Backbone = require('backbone')
  , _ = require('lodash')


module.exports = Backbone.View.extend({

    template: function(){},
    
    initialize: function(opts){
        if ( typeof this.model === 'function' )          
            this.model = new this.model(opts.attributes  || null, opts)
        else if( typeof this.collection === 'function' ) 
            this.collection = new this.collection(opts.models || null, opts)

        this.conn     = opts.connection
        this.boundObj = this.collection || this.model;

        if ( this.collection ) 
            this.boundObj.on('reset add remove sort', this.render, this);  
        else if ( this.model ) 
            this.boundObj.on('change add remove', this.render, this);       
    },

    

    fetch: function(opts){
        var self = this

        return self.boundObj
            .fetch(_.extend({ reset: true }, opts))
            .then(function(){
                self.bound = true;
            })
    },


    process: function(item){
        var data = item || this.boundObj.toJSON();

        return _.isArray(data) 
            ? { models: data }
            : data
    },

    render: function(noDraw){
        var self = this
          , data = "";

        data = self.process()    

        !noDraw && $(self.el).html(self.template(data));

        this.onRender && this.onRender();
         
        if ( noDraw ) 
            return self.template(data)
    },

    open: function( query ){
        query 
            ? this.fetch(query).then(this.render.bind(this))
            : this.render()
    },

    close: function(){
        this.$el.empty()
    }
})