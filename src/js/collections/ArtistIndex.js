var ApiCollection = require('./ApiCollection');

module.exports = ApiCollection.extend({
    model: require('../models/Artist'),
    url:   "/artists",
})