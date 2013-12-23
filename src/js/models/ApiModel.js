var Backbone = require('backbone')
  , $ = require('../lib/jquery-2.0.3.js')
  , api = require("../api")
  , utils = require('../utilities')

Backbone.$ = $;

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };


module.exports = Backbone.Model.extend({
    constructor: function(attr, opts) {
        if ( opts.connection ) this.conn = opts.connection;

        if ( !this.conn ) console.warn("No Api Connection specified!");

        Backbone.Model.apply(this, arguments);
    },
    sync: function(method, model, options){
        var conn = this.conn
          , url  = conn.server + _.result(this, 'url');

        options.type = methodMap[method];
        return conn.request(url, {}, options)
    }
})