var Handlebars = require("hbsfy/runtime")
  , _ = require('lodash');

module.exports = function(){

    Handlebars.registerHelper("rows", function(context, cnt, options) {
        var i = 0, len = context.length
          , row = []
          , out= '', attrs = '', data;
        
        options.hash.class = options.hash.class + ' row';

        attr = _.map(options.hash, function(v, k){  return k + "=\"" + v + "\"" });

        for(; i < len; i++) {
            row.push(context[i]);

            if ( (i + 1) % cnt === 0 || i >= len ){
                out += "<div " + attr + ">" + options.fn({ items: row }) + "</div>"
                row = [];
            }
        }

        return out;
    });

    var ops = {
            eq:  function(l, r){ return l === r },  
            neq: function(l, r){ return l !== r }, 
            gt:  function(l, r){ return l > r }, 
            gte: function(l, r){ return l >= r }, 
            lt:  function(l, r){ return l < r }, 
            lte: function(l, r){ return l <= r }, 
        };

    _.each(ops, function(fn, key){
        Handlebars.registerHelper(key, function(left, right, options) {
            return fn(left, right) 
                ? options.fn(this)
                : options.inverse(this);
        });
    })
    
}