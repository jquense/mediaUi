'use strict';

var View =  require('../View')
  , MediaList = require('../../collections/mediaPlayer/MediaList.js')
  , Slider = require('../Slider')
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
        'click a.play-btn'  : 'play',  
        'click a.pause-btn' : 'pause', 
        'click a.next-btn'  : 'next', 
        'click a.prev-btn'  : 'prev', 
    },

    initialize: function (opts) {
        var self = this;

        this.media = this.boundObj = new MediaList(opts.media, { player: this, conn: opts.connection });

        this._currentIdx = 0;
        this._currentMedia = null;

        this.looping = false;
        this.shuffling = false; //everybody is 

        msgBus.subscribe('addToPlaylist', function(msg, data){ self.addToPlaylist(data) });
        msgBus.subscribe('addToPlaylistNext', function(msg, data){ self.addToPlaylistNext(data) });
    },

    render: function(){
        var scrubber
          , buffer;

        View.prototype.render.call(this);

        buffer = new Slider({  el: '.media-buffer' });

        scrubber = new Slider({ 
            el: '.media-scrubber',
            adjustable: true,
            enable: false
        });

        scrubber.on('change', _.bind(this.seek, this))

        this.scrubber = scrubber;
        this.buffer   = buffer;
        var self = this;
    },

    addToPlaylist: function(mediaId){ 
        var media = toMedia(mediaId);

        this.media.push(media);
    },

    addToPlaylistNext:  function(mediaId){
        var media = toMedia(mediaId);

        this.media.add( media, { at: this._currentIdx + 1});
    },

    playToggle: function(){
        var play = !this._currentMedia || this._currentMedia.playState() === PAUSED;

        if ( this._currentMedia )
            this.togglePause(this._currentMedia.mediaId);
    },

    play: function(/* options */){
        var self = this
          , options = arguments[0] || {}
          , media;

        if ( this._currentMedia === null && this.media.length !== 0)
            this._currentMedia = this.media.at(0);
     
        _.extend( options, {
            onplay: function(){ 
                self.trigger('play')
            },
            onload: function(){
                console.log('load')
                self.scrubber.enable();       
            },
            onfinish:     _.bind(this.next, this, true),
            whileplaying: _.bind(this._playProgress, this),  
            whileloading: _.bind(this._loadProgress, this)
        })

        soundManager.play( this._currentMedia.mediaId, options);
    },

    pause: function(){
        var self = this
          , media = this._currentMedia;

        soundManager.pause( media.mediaId, {
            onpause: function(){ 
                self.trigger('pause') 
            }    
        });
    },

    stop: function(){
        var self = this
          , media = this._currentMedia;

        soundManager.stop( media.mediaId, {
            onstop: function(){ 
                self.trigger('stop');
            }    
        });
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
        this._currentMedia = this.media.at(idx);
        this._currentIdx = idx;
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
            this._currentMedia = this.media.at(idx);
            this._currentIdx = idx;
        }

        this.play({ position: 0 });
    },

    seek: function(pos){
        var id = this._currentMedia.mediaId
          , sound = this._currentMedia.sound;

        //this._media.seek(7)
        //console.log('seel: ',  Math.floor(pos / 1000) * 1000)
        //sound.stop();
        sound.setPosition(Math.floor(pos / 1000) * 1000 );
    },

    volume: function(per){
        var id = this._currentMedia.mediaId;

        if ( per < 0 || per > 100 ) 
            throw new Error("Volume must be between 0 & 100");

        if ( per === 0 ) soundManager.mute(id);
        else             soundManager.setVolume(id, per);
    },

    _playProgress: function(){
        var sound = this._currentMedia.sound
          , percent = sound.position / sound.duration
          , p = (sound.duration / 1000) * percent
          , min = Math.floor(p / 60), sec = Math.floor(p % 60);

        
        this.scrubber.max = sound.duration;
        this.scrubber.position( sound.position );

        //console.log("playing: ", sound.position, sound.duration)
        msgBus.publish('playing', this._currentMedia.sound.position )
    },

    _loadProgress: function(){
        var sound = this._currentMedia.sound
          , percent = (sound.bytesLoaded / sound.bytesTotal) * 100;

        //console.log('loading: ', sound.bytesLoaded, sound.bytesTotal)
        if ( percent >= 75 ) 
            this._preloadNext();

        if ( this.buffer.max == 0 ) this.buffer.max = 100;

        this.buffer.position(sound.bytesLoaded * 100 );

        this.loading = percent;

        msgBus.publish('loading', sound.bytesLoaded, sound.bytesTotal );
    },

    _preloadNext: function(){
        //var sound = this._currentMedia    
    }
});

function toMedia(mediaIds){
    return _.map( util.makeArray(mediaIds), function(m){ 
        return {
            mediaId: m
        }; 
    });
}
