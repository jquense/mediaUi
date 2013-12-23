

var Connection = require('./api/server')
    , conn     = new Connection();

var api = {
      media: require("./api/media")(conn)
    , navigation: ""
    , users: ""

};

module.exports = api;