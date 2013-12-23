var ApiCollection = require('./ApiCollection');


module.exports = ApiCollection.extend({
    model: require('../models/Media'),
    url: "/media",
})