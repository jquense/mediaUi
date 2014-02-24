var Backbone = require('backbone')
  , _ = require('lodash')


module.exports = Backbone.Collection.extend({
    
    value: function(values){
        var data = _.map(values, function(pair){
            var key = _.keys(pair)[0]

            return { 
                key: key, 
                text: pair[key] 
            }    
        });

        if ( data.length )
            data[data.length - 1].isActive = true;

        if ( this.home ) 
            data.shift({key: 'HOME', text: this.home })

        this.reset(data);
    },

    rootCrumb: function(key, text){
        var obj = {};

        obj[key] = text;

        this.value([ obj ]);
    },
    
    appendCrumb: function(key, text){
        this.resetActive();

        this.push({
            isActive: true,
            key: key,
            text: text      
        }) 
    },

    resetActive: function(){
        var active = this.findWhere({ isActive: true })   
        
        active && active.set('isActive', false); 
    }
})