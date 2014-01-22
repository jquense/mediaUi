var Backbone = require('backbone')
  , CollectionView = require('./CollectionView')
  , $ = require('../lib/jquery-2.0.3.js')
  , _ = require('lodash')
  , AlbumCol = require('../collections/Albums')

Backbone.$ = $;


module.exports = CollectionView.extend({
    
    collection: AlbumCol,

    itemTemplate : require('../templates/album.hbs'),

    events: {
        "click a.album-link": "selectAlbum"
    },

    process: function(item){
        var data = item.toJSON();

        data.album    = data._id || "No Album";
        data.coverArt = this.conn.server + data.image || '/img/defaultAlbumLight.png';

        return data;
    },

    selectAlbum: function(e){
        var alb = this.boundObj.get(e.target.getAttribute("data-cid"))

        this.trigger("select", alb && alb.toJSON());
    }
})