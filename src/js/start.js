"use strict";

var $ = require('./lib/jquery-2.0.3.js')
  , Backbone = require('backbone')
  , Connection = require('./api/server.js')
  , MediaPlayer = require('./views/mediaPlayer/MediaPlaylist');

require('./templating/helpers.js')();
require('./templating/partials.js')();

$(function(){
    var lib = require('./views/library/Library')
      , conn = new Connection('http://localhost:3000', '/auth', 'another_client')

    conn.authenticate(function(resp){
        new lib({ el: $("body"), connection:conn })

        var player = new MediaPlayer({ el: $('#NowPlayingPanel' ), connection: conn  })

        player.open();

        Backbone.history.start({pushState: true})
    })

})