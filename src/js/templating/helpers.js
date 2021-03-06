'use strict';
var Handlebars = require('hbsfy/runtime')
  , _ = require('lodash');

module.exports = function(){

    Handlebars.registerHelper('partl', function(partial, context, options) {
        if (!partial) console.error('No partial name given.')

        partial = Handlebars.partials[partial];

        if (!partial) return ''

        context = _.extend({}, context, options.hash);

        return new Handlebars.SafeString( partial(context) );
    });

    Handlebars.registerHelper('take', function(context, cnt, from, options) {
        if ( !options ) {
            options = from;
            from = 0;
        }

        var fn = options.fn
          , ret = '';

        if ( typeof context === 'function')
            context = context.call(this);

        context = context.slice(from, (from + cnt))

        _.each(context, function(item){
            ret += fn(item);
        })

        return ret;
    });

    Handlebars.registerHelper('rows', function(context, cnt, options) {
        var i = 0, len = context.length
          , row = []
          , out= '' , attrs;

        options.hash.class = (options.hash.class || '') + ' row'

        attrs = _.map(options.hash, function(v, k){  return k + '=\'' + v + '\'' })

        for(; i < len; i++) {
            row.push(context[i]);

            if ( (i + 1) % cnt === 0 ){
                out += '<div ' + attrs + '>' + options.fn({ items: row }) + '</div>'
                row = [];
            }
        }

        if ( row.length )
            out += '<div ' + attrs + '>' + options.fn({ items: row }) + '</div>'

        return out
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