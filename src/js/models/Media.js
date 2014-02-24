var ApiModel = require('./ApiModel')
  , soundManager = require('../lib/soundmanager2.js')
  , _ = require('lodash')
  , utils = require('../utilities')


module.exports = ApiModel.extend({
    idAttribute:  '_id',

    urlRoot: '/media',

    initialize: function(attr, options){
        ApiModel.prototype.initialize.call(this, attr, options)

        var query = this.connection.queryString(true)
          
        this.stream   = _.result(this, 'url') + '/stream' + query;
        this.coverArt = _.result(this, 'url') + '/coverart' + query;
        this.soundId  = 'snd_' + this.get('_id');
    },

    state: function(){
        return (this.sound && this.sound.playState) || 0;    
    },

    createSound: function(){
        var self = this;

        this.sound = soundManager.createSound({ 
            id:  this.soundId, 
            url: this.stream,
            stream:    false,
            multiShot: false,
            onplay:       self.trigger.bind(self, 'play'),
            onpause:      self.trigger.bind(self, 'paused'), 
            onstop:       self.trigger.bind(self, 'stopped'), 
            onload:       self.trigger.bind(self, 'loaded'),
            onfinish:     self.trigger.bind(self, 'done'),
            whileloading: function (){
                self.trigger('loading', self.sound)
            },
            whileplaying: function (){
                self.trigger('playing', self.sound)
            }
        }); 
        
        return this.sound   
    },

    play: function(/* options */){
        var options = arguments[0] || {}

        if ( !this.sound ) this.createSound()

        soundManager.play( this.soundId, options )
    },

    pause: function(){
        this.sound  
            && soundManager.pause( this.soundId )
    },

    stop: function(){
        this.sound  
            && soundManager.stop( this.soundId)
    },

    seek: function(pos){
        if ( !this.sound ) this.createSound()

        this.sound.setPosition(Math.floor(pos / 1000) * 1000 );
    },
})