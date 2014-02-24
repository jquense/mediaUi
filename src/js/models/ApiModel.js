var Backbone = require('backbone')
  , _ = require('lodash')
  , $ = require('../lib/jquery-2.0.3.js')
  , api = require('../api')
  , utils = require('../utilities')

Backbone.$ = $;

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

var connError = function() {throw new Error('A \'connection\' property must be specified');}
  , urlError  = function() {throw new Error('A \'url\' property or function must be specified');};

module.exports = Backbone.Model.extend({


    constructor: function(attr, opts) {
        this.connection = opts.connection || opts.collection.connection || connError()

        Backbone.Model.apply(this, arguments)
    },

    sync: function(method, model, options){
        options.type = methodMap[method]

        return this.conn.request(_.result(this, 'url'), {}, options)
    },

    url: function(){
        var base = this.connection.server
        
        base += _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError()

        if (this.isNew()) return base
        
        return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id)
    },
})