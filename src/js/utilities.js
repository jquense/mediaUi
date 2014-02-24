var _ = require('lodash');

module.exports = {
    
    get: function(obj, path){
        if ( typeof obj === 'string') {
            path = obj;
            obj  = window;
        }

        var parts = path.split(".")

        while (parts.length) {
            obj = obj[parts.shift()]
        }

        return obj
    },
    makeArray: function(arr){
        return _.isArray(arr) ? arr : [ arr ]; 
    },   
    
    toTimestamp: function(secs){
        var time = secs
          , hours = Math.floor(time / 3600);
    
        time -= hours * 3600;

        var minutes = Math.floor(time / 60);
        time -= minutes * 60;

        var seconds = parseInt(time % 60, 10);

        return ( hours ? hours + ':'  : '' ) + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    }
}