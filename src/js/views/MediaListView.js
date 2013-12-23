var CollectionView = require('./CollectionView')
  , MediaCol = require('../collections/MediaCollection')
  , _ = require('lodash')
  

module.exports = CollectionView.extend({
    
    collection: MediaCol,

    process: function(item){
        var data = item.toJSON();

        data.title  = data.title || data.name;
        data.track  = data.track && data.track.no;
        data.disk   = data.disk  && data.disk.no;
        data.length = toTimestamp(data.duration || 0)
        data.coverArt = this.conn.server + "/media/" + data._id + "/coverart"

        return data;
    },

    itemTemplate : require('../templates/media.hbs')

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