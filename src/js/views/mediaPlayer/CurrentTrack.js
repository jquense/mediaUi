'use strict';

var View =  require('../View')
  , Slider = require('../Slider')
  , _ = require('lodash')
  , msgBus = require('pubsub-js')
  , util = require('../../utilities')
  , format = require('util').format


module.exports = View.extend({

    template: require('../../../templates/mediaPlayer/currentTrack.hbs'),

    model: require('../../models/Media'),
    
    initialize: function (opts) {
        var self = this

        View.prototype.initialize.call(this, opts)

        _.bindAll(this)

        if ( this.model )
            this.model
                .on('playing', _.throttle(this._playProgress, 1000))
                .on('loading', _.throttle(this._loadProgress, 1000))
    },

    process: function(){
        var data = this.model && this.model.toJSON()

        if ( !data ) return {}
 
        data.title  = data.title || data.name;
        data.track  = data.track && data.track.no;
        data.disk   = data.disk  && data.disk.no;
        data.length = util.toTimestamp(data.duration || 0)
        data.coverArt = this.model.coverArt

        return data;
    },

    render: function(){
        var self = this
          , scrubber, buffer;

        View.prototype.render.call(this)

        buffer = new Slider({  el: '.media-buffer' })

        scrubber = new Slider({ 
            el: '.media-scrubber',
            adjustable: true,
            enable: !!this.model
        });

        scrubber.on('change', function(pos){
            self.model.seek(pos)    
        })

        this.scrubber = scrubber
        this.buffer   = buffer
    },
     
    _playProgress: function(sound){
        var pos = util.toTimestamp(sound.position / 1000)
          , dur = util.toTimestamp(sound.duration / 1000)

        this.scrubber.max = sound.duration
        this.scrubber.position( sound.position )
        this.$('.track-duration').text(pos + ' / ' + dur )
    },

    _loadProgress: function(sound){
        var percent = (sound.bytesLoaded / sound.bytesTotal) * 100

        if ( this.buffer.max == 0 ) this.buffer.max = 100

        this.buffer.position(sound.bytesLoaded * 100)
    },

});
