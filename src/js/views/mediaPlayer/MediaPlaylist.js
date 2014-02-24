'use strict';

var View =  require('../View')
  , TrackInfo = require('./CurrentTrack.js')
  , MediaList = require('../../collections/mediaPlayer/MediaList.js')
  , Audio = require('../../lib/audio5.js')
  , soundManager = require('../../lib/soundmanager2.js')
  , _ = require('lodash')
  , util = require('../../utilities')
  , msgBus = require('pubsub-js')
  , PAUSED = 0;

soundManager.setup({
    url: '/swf/soundmanager2.swf',
    debugFlash: true
    //preferFlash: true,
    //useHTML5Audio: false,
});


module.exports = View.extend({

    template: require('../../../templates/mediaPlayer/mediaPlayer.hbs'),

    events: {
        'click a.play-toggle-btn'  : 'playToggle',  
        'click a.next-btn'  : 'next', 
        'click a.prev-btn'  : 'prev' 
    },

    initialize: function (opts) {
        var self = this

        View.prototype.initialize.call(this, opts)

        this.media = this.boundObj = new MediaList(opts.media, { player: this, conn: opts.connection })

        this._currentIdx = 0
        this._currentMedia = null

        this.looping = false
        this.shuffling = false //everybody is 

        msgBus.subscribe('addToPlaylist', function(msg, data){ self.addToPlaylist(data) })
        msgBus.subscribe('addToPlaylistNext', function(msg, data){ self.addToPlaylistNext(data) })
    },

    render: function(){
        View.prototype.render.call(this)

        this._trackInfo()
    },

    addToPlaylist: function(model){ 
        this.media.push(model)

        if ( this.media.length === 1 ) 
            this._setMedia(0)
    },

    addToPlaylistNext:  function(model){
        this.media.add( model, { at: this._currentIdx + 1})

        if ( this.media.length === 1 ) 
            this._setMedia(0)
    },

    playToggle: function(){
        var play = !this._currentMedia || this._currentMedia.state() === PAUSED

        play
            ? this.play()
            : this.pause()
    },

    play: function(/* options */){
        var self = this
          , options = arguments[0] || {};

        if ( self._currentMedia === null && self.media.length !== 0)
            self._setMedia(0);
     
        self._currentMedia.play(options)
    },

    pause: function(){
        var media = this._currentMedia;

        media && media.pause()
    },

    stop: function(){
        var media = this._currentMedia;

        media && media.stop()
    },

    next: function(stopAtEnd){
        var length = this.media.length
          , idx = this._currentIdx + 1
          , next;

        if ( idx === length ){ //last one
            if ( stopAtEnd ) return;
            
            idx = 0;
        }

        this.stop();
        this._setMedia(idx)
        this.play({ position: 0 });
    },

    prev: function(){
        var length = this.media.length
          , media = this._currentMedia
          , idx = this._currentIdx - 1;

        if ( idx < 0 ) idx = 0;

        if (  media.state() !== PAUSED && media.sound.position > 5000 )
            return this.seek(0)
        
        if ( idx !== this._currentIdx ) {
            this.stop();
            this._setMedia(idx)
        }

        this.play({ position: 0 });
    },

    volume: function(per){
        var id = this._currentMedia.soundId;

        if ( per < 0 || per > 100 ) 
            throw new Error('Volume must be between 0 & 100');

        if ( per === 0 ) soundManager.mute(id);
        else             soundManager.setVolume(id, per);
    },

    _trackInfo: function(){
        this.info && this.info.close()

        this.info = new TrackInfo({ 
            el: this.$('.track-info'),
            model: this._currentMedia,
            connection: this.conn
        })

        this.info.render()
    },

    _setMedia: function(idx){
        var media = this.media.at(idx)

        this._currentMedia = media;
        this._currentIdx   = idx;
        this._trackInfo();   
    },

    _preloadNext: function(){
        //var sound = this._currentMedia    
    }
});

