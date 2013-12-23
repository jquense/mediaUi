"use strict";

var _ = require('lodash')
  , Connection = require('../api/server')
  , AppArea    = require('./AppArea')
  , view       = require('../views/library')

module.exports = function($scope){
    var conn = new Connection()
      , lib  = new AppArea({
            el: $scope,
            connection: conn,
            view:       view,
            routes: {
                "artists(/:artist)": "artists"
            }
        })

    

    lib.onRoute("artist", function(artist){
        this.start()
    })

    return lib;
}

