"use strict";

var CollectionView = require('./CollectionView')
  , Backbone = require('Backbone')
  , $ = require('../lib/jquery-2.0.3.js')
  , _ = require('lodash')
  

Backbone.$ = $;

module.exports = CollectionView.extend({
	itemTemplate: require('../../templates/library/breadCrumbs.hbs'),

    collection: require('../collections/library/BreadCrumbs'),

    events: {
        "click a.crumb" : "selectCrumb"
    },
    initialize: function(options){
        CollectionView.prototype.initialize.call(this, options)

        this.home = options.home || true;
    },

    process: function(data){

        return data.toJSON()
    },

    value: function(values){
        if ( !values) return this.collection.toJSON();

        this.collection.value(values)
    },

    valuesUntil: function(until){
        var data = this.collection.toJSON()
          , next;

        if ( until ) 
            data = _.first(data, function(k){ 
                if ( next ) return false;
                next = k.key === until;
                return true; 
            })

        return _.pluck(data, 'text');
    },

    selectCrumb: function(e){
        e.preventDefault();
        this.trigger('select', e.target.getAttribute('data-key'))
    },

    root: function(key, text){
        this.collection.rootCrumb(key, text)
    },

    append: function(key, text){
        this.collection.appendCrumb(key, text);
    }
});