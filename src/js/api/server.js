'use strict';
/*global $ */

var blue = require('bluebird')
  , _ = require('lodash')
  , Url = require('url')
  , ajax = require('../lib/ajax')
  , methodMap = {
    'post': 'POST',
    'put' : 'PUT',
    'del' : 'DELETE',
    'get' : 'GET'
  };

function encode(user, password) {
  return btoa(user + ':' + password);
}


function Connection(server, endpoint, clientId){
    this.server  = server
    this.clientId = clientId
    this.redirectUri = endpoint
    this.access_token = this.getToken()
}


Connection.prototype = {
    authenticate: function(cb){
        var query = Url.parse(location.href, true).query
          , token = this.access_token
          , hash = splitHash() || {}

        if ( token ) 
            return cb()    
        
        if ( location.pathname === this.redirectUri) {
            if (location.hash && hash.access_token) {
                this.setTokens(hash.access_token, hash.refresh_token)
                window.location = location.orgin
            }
            else if (query.code !== undefined) {
                this.requestAccessToken(this.redirectUri, query.code, 'my_client')
                    .then(cb)

            } else if (query.error )
                alert(query.error + ': ' + query.error_description)
        }
        else
            this.requestAuthCode(this.redirectUri, 'my_client')
    },

    requestAuthCode: function( landingPoint, clientId ){
        var redirect = location.origin + landingPoint
          , query = '/oauth/authorize?response_type=token&client_id=' + clientId + '&redirect_uri=' + redirect
        
        window.location = this.server + query
    },

    requestAccessToken: function( redirect, code, clientId ){
        var self = this
          , url = this.server +'/oauth/token'
          , xhr = ajax(url, {
            method: 'POST',
            data: {
                grant_type: 'authorization_code',
                client_id: clientId,
                redirect_uri: location.origin + redirect,
                code: code
            }    
        })
        
        return xhr.then(function(rsp){
            self.setTokens(resp.access_token, resp.refresh_token)
        })
    },

    setTokens: function(token, refresh){
        localStorage.setItem('porch_access_token', token)
        refresh && localStorage.setItem('porch_refresh_token', refresh)
    },

    getToken: function(){
        return localStorage.getItem('porch_access_token')
    },

    request: function(url, params, opts){
        opts = opts || {};

        if ( opts.data ) 
            params = _.extend({}, opts.data, params)

        opts = _.extend({}, opts, this.parseUrl(url, params), {
            crossDomain: true,
            dataType: 'json',
            headers: { 
                Authorization: 'Bearer ' + this.access_token }  
        });

        return ajax(opts)
    },
    
    parseUrl: function (url, params){
        var paramReg = /(:[^/]*?)(\/|$)/
          , pathParams = [ params ]
          , paramStr, param;

        while ( paramReg.test(url) ){
            paramStr = url.match(paramReg)[1];
            param    = paramStr.substring(1)
            url      = url.replace(paramStr, params[param] || '')

            pathParams.push(param)
        }

        url = url.replace('//', '').trim()
        url = url.charAt(url.length - 1) === '/' ? url.substring(0, url.length - 1) : url;

        return { 
            url:  this.server + url, 
            data: _.omit.apply(_, pathParams) 
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

function splitHash(){
    var qry = location.hash.substring(1)
    
    qry = qry.split('&')

    return _.reduce(qry, function(rslt, item){
        var idx = item.indexOf('=')
          , key = item, val = ''
          ;
          
        if (idx >= 0) {
            key = item.substring(0, idx)    
            val = item.substring(idx + 1)
        }
        rslt[key] = val;
        return rslt;
    }, {})
}