
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
    }    
    
}