var _ = require('lodash')
  , AppView = require('../AppView');
  

module.exports = AppView.extend({
    routes: {
        "artists(/:artist)"       : "loadMain",
        "artists/:artist/:albums" : "loadMain"
    },
    children: {
        crumbs:    { 
            view:  [ require('../BreadCrumbView'), ".breadcrumb"],
            events: {
                "select" : "crumbSelect"
            }
        },
        artists:    { 
            region: 'main .main-content', 
            view  : require('./ArtistIndex')
        },
        albums:    { 
            region: 'main .main-content', 
            view  : require('./Albums')
        },
        mediaList: { 
            region: 'main .main-content', 
            view  : require('./MediaListView')  
        },
    },

    currentView: null,

    loadIndex: function(force){
        var index = this.views.index;

        if ( force || !index.collection.models.length ) index.fetch();
    },

    crumbSelect: function(key){
        var values = this.views.crumbs.valuesUntil(key);

        this.router.navigate('/artists/' + values.join('/'), true  )
    },

    setCrumbs: function(obj){
        var arr = []

        if ( obj.artist ) arr.push({ artist: obj.artist })
        if ( obj.album )  arr.push({ album:  obj.album })

        this.views.crumbs.value(arr)    
    },
    loadMain: function(artist, album){
        var region = this.regions.main
          , view   = album ? 'mediaList' : artist ? 'albums' : 'artists'
          , data   = {};
        
        //this.loadIndex();

        if ( album ) data.album  = album;
        if ( artist) data.artist = artist;
         
        region.openView(view, { data: data }) 
        
        this.setCrumbs(data)
    }
})