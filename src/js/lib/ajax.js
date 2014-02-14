var $ = require('./jquery-2.0.3.js')
  , Promise = require('bluebird')

module.exports = function(){
    var xhr = $.ajax.apply($, arguments)

    return Promise.cast(xhr).cancellable()
        .caught(Promise.CancellationError, function(e){
            xhr.abort()
            throw e
        })
}