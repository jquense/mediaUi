﻿var Backbone = require('backbone')
  , CollectionView = require('../CollectionView')
  , $ = require('../../lib/jquery-2.0.3.js')
  , _ = require('lodash')
  , format = require('util').format
  , AlbumCol = require('../../collections/Albums')

Backbone.$ = $;


module.exports = CollectionView.extend({
    tagName: 'ul',
    className: 'media-list',

    collection: AlbumCol,

    itemTemplate : require('../../../templates/album.hbs'),

    events: {
        "click a.album-link": "selectAlbum"
    },

    process: function(item){
        var data = item.toJSON()
          , url  = format("%s%s?access_token=%s&token_type=bearer",
            this.conn.server, data.image, this.conn.access_token);

        data.album    = data._id || "No Album";
        data.coverArt = data.image ? url : '/img/defaultAlbumLight.png';

        return data;
    },

    selectAlbum: function(e){
        var alb = this.boundObj.get(e.target.getAttribute("data-cid"))

        this.trigger("select", alb && alb.toJSON());
    }
})