"use strict";

module.exports = function(conn){

    return {
        getArtists: function(params, options){
            return conn.get("/artists/:artist", params, options);
        },

        getAlbums: function(params, options){
            return conn.get("/albums/:album", params, options);
        },     
    
        getMedia: function(params, options){
            return conn.get("/media/:mediaId", params, options);
        },

        stream: function(params, options){
            return conn.get("/media/:mediaId/stream", params, options);
        },

        download: function(params, options){
            return conn.get("/media/:mediaId/download", params, options);
        },
    }
}