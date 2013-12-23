var Backbone = require('backbone')
  , View = require('./View')
  , $ = require('../lib/jquery-2.0.3.js')
  , _ = require('lodash')


module.exports = View.extend({

    itemTemplate: "",

    process: function(item){
        return item;
    },
    render: function(){
        var self = this
          , obj = self.boundObj
          , str = "";

        str = _.reduce(obj.models, function(memo, item){
            var data     = self.process(item)
            return memo += self.itemTemplate(data)
        }, "") 
        

        $(self.el).html(str);
    },

})