var ApiCollection = require('./ApiCollection');


module.exports = ApiCollection.extend({
    model: require('../models/Album'),
    url: "/albums",
})