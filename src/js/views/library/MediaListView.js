'use strict';
var CollectionView = require('../CollectionView')
  , MediaCol = require('../../collections/MediaCollection')
  , _ = require('lodash')
  , format = require('util').format
  , msgBus = require('pubsub-js');
  

module.exports = CollectionView.extend({
    tagName: 'ul',
    className: 'media-list',

    collection: MediaCol,

    events: {
        'click a.media-link': 'addToPlaylist'
    },

    initialize: function(opt,a ){
        CollectionView.prototype.initialize.call(this, opt, a)

        this._el = this.$el; 
    },
    process: function(item){
        var data = item.toJSON();

        data.title  = data.title || data.name;
        data.track  = data.track && data.track.no;
        data.disk   = data.disk  && data.disk.no;
        data.length = toTimestamp(data.duration || 0)
        data.coverArt = item.coverArt
        
        return data;
    },

    itemTemplate : require('../../../templates/media.hbs'),

    addToPlaylist: function(e){
        console.log('here')
        var model = this.collection.get(e.target.getAttribute('data-cid'))
        
        msgBus.publish('addToPlaylist', model );
    }
})

function toTimestamp(secs){
    var time = secs
      , hours = Math.floor(time / 3600);
    
    time -= hours * 3600;

    var minutes = Math.floor(time / 60);
    time -= minutes * 60;

    var seconds = parseInt(time % 60, 10);

    return ( hours ? hours + ':'  : '' ) + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
}