var ApiModel = require('./ApiModel')
  , utils = require('../utilities')


module.exports = ApiModel.extend({
    idAttribute:  "_id",
    urlRoot: "/albums",
})