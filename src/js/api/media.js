'use strict';

module.exports = function(conn){
    var urls = {
            artist:   '/artists/:artist',
            albums:   '/album/:album',
            media:    '/media/:mediaId',
            stream:   '/media/:mediaId/stream',
            download: '/media/:mediaId/download'
        }

    return {
        getArtists: function(params, options){
            return conn.get('/artists/:artist', params, options);
        },

        getAlbums: function(params, options){
            return conn.get('/albums/:album', params, options);
        },     
    
        getMedia: function(params, options){
            return conn.get('/media/:mediaId', params, options);
        },

        stream: function(params, options){
            return conn.get('/media/:mediaId/stream', params, options);
        },

        download: function(params, options){
           return conn.get('/media/:mediaId/download', params, options);
        }
    }
}