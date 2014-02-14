var Backbone = require('backbone')
  , CompositeView = require('./SwitchView')
  , Q = require('q')
  , _ = require('lodash')

module.exports = CompositeView.extend({

    children: {
        albums:    { 
            region: 'main .main-panel', 
            view  : [ require('./Albums'),        ".media-list"]
        },
        mediaList: { 
            region: 'main .main-panel', 
            view  : [ require('./MediaListView'), ".media-list"]
        },
    },

    

})