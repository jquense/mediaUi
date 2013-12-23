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

    selectAlbum: function(e){
        var artist = this.boundObj.get(e.target.getAttribute("data-cid"))

        this.trigger("select", artist && artist.toJSON());
    }
})