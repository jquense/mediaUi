'use strict';
var Collection =  require('backbone').Collection
  , _ = require('lodash');


module.exports = Collection.extend({

    model: require('../../models/mediaPlayer/PlaylistItem'),
    url:   '/media',

    initialize: function(models, options) {
        this.player = options.player;
        this.conn = options.conn;

        this.on('remove', function(model){
            model.sound.destruct();
        })
    }

})
