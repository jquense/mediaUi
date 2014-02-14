var Backbone = require('backbone')
  , _ = require('lodash')
  , $ = require('../lib/jquery-2.0.3.js')
  , model = require('../models/Artist')

Backbone.$ = $;

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

function encode(user, password) {
  return btoa(user + ':' + password);
}


module.exports = Backbone.Collection.extend({

    //model: model,
    //url:   model.prototype.urlRoot,

    initialize: function(models, opts){
        this.connection = opts.connection;
    },

    sync: function(method, model, options){
        var conn = this.connection
          , url  = _.result(this, 'url');

        options.type = methodMap[method];
        return conn.request(url, {}, options)
    }
})