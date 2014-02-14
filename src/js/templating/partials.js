var Handlebars = require("hbsfy/runtime")
  , _ = require('lodash');

module.exports = function(){

    Handlebars.registerPartial('imageGrid', require('../../templates/_imageGrid.hbs'))
    
}