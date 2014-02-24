'use strict';

var View = require('../View')
  , Backbone = require('Backbone')
  , $ = require('../../lib/jquery-2.0.3.js')
  , _ = require('lodash')
  , articles = [ 'the', 'el', 'la', 'los', 'las', 'le', 'les'];

Backbone.$ = $;


module.exports = View.extend({
    tagName: 'div',
    className: 'media-list container',
	template:   require('../../../templates/library/artistList.hbs'),

    collection: require('../../collections/ArtistIndex'),

	events: {
        'click a.artist-link': 'selectArtist'
    },

	process: function(){
		var groups = _(this.collection.toJSON()).groupBy(function(m){
			    return m._id ? woutArticle(m._id).charAt(0).toUpperCase(): '';
		    })
            .map(function(artists, letter){
                return { 
                    index: letter, 
                    artists: artists
                }
            })
            .sortBy('index')
            .value()

		return { models: groups, prefix: this.conn.server, query: this.conn.queryString(true) }
	},

    onRender: function(){
        this.$('img[data-src]').unveil();  
    },

    selectArtist: function(e){
        var artist = this.boundObj.get(e.target.getAttribute('data-id'))

        this.trigger('select', artist && artist.toJSON());
    }
});

function woutArticle(str){
    var r = str
      , lower = str.toLowerCase();
     
    _.each(articles, function(article){
        if ( 0 === lower.indexOf(article + ' ') ) 
            r = str.substring(article.length + 1);
    }) 
    
    return r; 
}