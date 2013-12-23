"use strict";
/*global $ */

var Q = require('q')
  , _ = require('lodash')
  , methodMap = {
    'post': 'POST',
    'put' : 'PUT',
    'del' : 'DELETE',
    'get' : 'GET'
  };

function encode(user, password) {
  return btoa(user + ':' + password);
}


function Connection(server, username, pw, ver){
    this.server  = server || "http://localhost:3000",
    this.version = ver || "*"
    this.hash    =  encode("admin", "Virus188")
}


Connection.prototype = {
    addCredentials: function(username, pw){
        localStorage.setItem("porch_hash", encode(username, pw) )
    },

    getHash: function(){
        return localStorage.getItem("porch_hash")
    },

    request: function(url, params, opts){
        opts = opts || {};

        if ( opts.data ) 
            params = _.extend({}, opts.data, params)

        opts = _.extend({}, opts, this.parseUrl(url, params), {
            crossDomain: true,
            dataType: "json",
            headers: { Authorization: "Basic " + this.hash },  
        });

        return Q($.ajax(opts))
    },
    
    parseUrl: function (url, params){
        var paramReg = /(:[^/]*?)(\/|$)/
          , pathParams = []
          , paramStr, param;

        while ( paramReg.test(url) ){
            paramStr = url.match(paramReg)[1];
            param    = paramStr.substring(1)
            url      = url.replace(paramStr, params[param] || "")

            pathParams.push(param)
        }

        url = url.replace("//", "").trim()
        url = url.charAt(url.length - 1) === "/" ? url.substring(0, url.length - 1) : url;

        return { 
            url:  this.server + url, 
            data: _.omit.apply(_, [ params ].concat(pathParams)) 
        }
    }  
}

_.each(methodMap, function(httpMethod, fnName){
    Connection.prototype[fnName] = function(url, params, opts){
        opts      = opts || {}
        opts.type = httpMethod;

        return this.request(url, params, opts);
    }
})

module.exports = Connection;

