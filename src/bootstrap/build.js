var gulp = require('gulp'); 

// Include Our Plugins
var less = require('gulp-less')
  , header = require('gulp-header') 
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename');

var bsBanner = '/*!\n' +
               ' * Bootstrap v3.0.2 by @fat and @mdo\n' +
               ' * Copyright <%= year %> Twitter, Inc.\n' +
               ' * Licensed under http://www.apache.org/licenses/LICENSE-2.0 \n' +
               ' *\n' +
               ' * Designed and built with all the love in the world by @mdo and @fat.\n' +
               ' */\n\n'
  , jqueryCheck = 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n'
  , scripts = [
        'src/bootstrap/js/transition.js',
        'src/bootstrap/js/alert.js',
        'src/bootstrap/js/button.js',
        'src/bootstrap/js/carousel.js',
        'src/bootstrap/js/collapse.js',
        'src/bootstrap/js/dropdown.js',
        'src/bootstrap/js/modal.js',
        'src/bootstrap/js/tooltip.js',
        'src/bootstrap/js/popover.js',
        'src/bootstrap/js/scrollspy.js',
        'src/bootstrap/js/tab.js',
        'src/bootstrap/js/affix.js'
    ]

function getStyles() {
    return gulp.src('src/bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
}

 function getScripts() {
    return gulp.src(scripts)
        .pipe(header(bsBanner + jqueryCheck, { year: (new Date()).getFullYear()}))
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

module.exports = function() {
    getStyles()
    getScripts()
}

