'use strict';
var Model = require('Backbone').Model
  , utils = require('../../utilities')
  , soundManager = require('../../lib/soundmanager2.js')
  , _ = require('lodash');


module.exports = Model.extend({
    urlRoot: '/media',

    initialize: function(attr, options){
        var id = this.get('mediaId')
          , sound = soundManager.createSound({ 
                id: id, 
                url: _.result(this, 'url') + '/stream',
                stream: false,
                multiShot: false,
            });

        this.stream = _.result(this, 'url') + '/stream';
        this.mediaId = id;
        this.sound = sound;
    },

    url: function() {
        var conn = this.conn || this.collection.conn
          , base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') ;

        return conn.server + '/media/' + encodeURIComponent(this.get('mediaId'));
    },

    state: function(){
        return this.sound.playState;    
    }
})