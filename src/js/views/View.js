var Backbone = require('backbone')
  , _ = require('lodash')


module.exports = Backbone.View.extend({

    template: function(){},
    
    initialize: function(opts){
        if ( typeof this.model === 'function' )          this.model      = new this.model(opts.attributes  || null, opts)
        else if( typeof this.collection === 'function' ) this.collection = new this.collection(opts.models || null, opts)

        this.conn     = opts.connection
        this.boundObj = this.collection || this.model;

        if ( this.boundObj )
            this.boundObj.on('all', this.render, this);       
    },

    

    fetch: function(opts){
        var self = this

        return self.boundObj
            .fetch(opts)
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

    render: function(){
        var self = this
          , data = "";

        data = self.process()    

        $(self.el).html(self.template(data));
    },

    open: function( query ){
        query 
            ? this.fetch(query)
            : this.render()
    },
    close: function(){
        this.remove()
    }
})