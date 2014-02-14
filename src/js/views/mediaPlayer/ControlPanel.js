'use strict';

var CompositeView =  require('../View')
  , MediaList = require('../../collections/mediaPlayer/MediaList.js')
  , Slider = require('../Slider')
  , soundManager = require('../../lib/soundmanager2-nodebug.js')
  , _ = require('lodash')
  , util = require('../../utilities')
  , msgBus = require('pubsub-js')
  , PAUSED = 0;

soundManager.setup({
    url: '/swf/soundmanager2.swf'
});


module.exports = View.extend({

    template: require('../../../templates/mediaPlayer/mediaPlayer.hbs'),


    events: {
        'click a.play-btn' : 'play',  
        'click a.pause-btn' : 'pause', 
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
        View.prototype.render.call(this);

        this.scrubber = new Slider({ el: '.media-scrubber' });

        this.scrubber.render();  
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

        this[play ? 'play' : 'pause']();
    },

    play: function(){
        var self = this
          , media;

        if ( this._currentMedia === null && this.media.length !== 0)
            this._currentMedia = this.media.at(0);

        media = this._currentMedia;

        soundManager.play( media.mediaId, {
            onplay: function(){ 
                self.trigger('play') 
            },
            onload: function(){
                self.scrubber        
            },
            onfinish:     _.bind(this.next, this, true),
            whileplaying: _.bind(this._playProgress, this),  
            whileloading: _.bind(this._loadProgress, this)
        });
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

    next: function(stopAtEnd){
        var length = this.media.length
          , idx = this._currentIdx + 1;

        if ( idx === length ){ //last one
            if ( stopAtEnd ) return;
            
            idx = 0;
        }

        this._currentMedia = this.media.at(idx);
        this._currentIdx = idx;
        this.play();
    },

    prev: function(){
        var length = this.media.length
          , idx = this._currentIdx - 1;

        if ( idx < 0 ) idx = 0;

        if ( idx !== this._currentIdx ) {
            this._currentMedia = this.media.at(idx);
            this._currentIdx = idx;
        }

        this.play();
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

        msgBus.publish('playing', this._currentMedia.sound.position )
    },

    _loadProgress: function(){
        var sound = this._currentMedia.sound
          , percent = (sound.bytesLoaded / sound.bytesTotal) * 100;

        if ( precent >= 75 ) 
            this._preloadNext();

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
