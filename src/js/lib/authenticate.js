var url = require('url')

module.exports = function(connection, endpoint, cb){
    var query = url.parse(location.href, true).query

    if ( location.pathname === endpoint) {
        
        if (query.code !== undefined) {
            connection.requestAccessToken(endpoint, query.code, 'my_client')
                .then(function(resp){
                    console.log(resp)
                    cb(resp)    
                })

        } else if (query.error )
            alert(query.error + ': ' + query.error_description)
    }
    if ( location.pathname !== endpoint)
        connection.requestAuthCode(endpoint, 'my_client')
    
}