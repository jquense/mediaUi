"use strict";

var View = require('./View')
  , Backbone = require('Backbone')
  , $ = require('../lib/jquery-2.0.3.js')
  , _ = require('lodash')
  

Backbone.$ = $;


module.exports = View.extend({
	template:   require('../templates/artistsIndex.hbs'),

    collection: require('../collections/ArtistIndex'),

	events: {
        "click a.artist-link": "selectArtist"
    },

	process: function(){
		var groups = _(this.collection.models).groupBy(function(m){
			    return m.id ? m.id.charAt(0).toUpperCase(): "";
		    })
            .map(function(artists, letter){
                return { index: letter, artists: artists}
            })
            .sortBy("index")
            .value()

		return { models: groups }
	},

    selectArtist: function(e){
        var artist = this.boundObj.get(e.target.getAttribute("data-cid"))

        this.trigger("select", artist && artist.toJSON());
    }
});