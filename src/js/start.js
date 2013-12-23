"use strict";

var $ = require('./lib/jquery-2.0.3.js')
  , Backbone = require('backbone')
  , Connection = require('./api/server.js');

  
$(function(){
    var lib = require('./views/Library')
    
    new lib({ el: $("body"), connection: new Connection()})

    Backbone.history.start({pushState: true})
})