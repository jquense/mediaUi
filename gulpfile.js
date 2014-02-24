var gulp = require('gulp')
  , bootstrap = require('./src/bootstrap/build'); 

// Include Our Plugins
var jshint = require('gulp-jshint')
  , watch = require('gulp-watch')
  , less = require('gulp-less')
  , plumber = require('gulp-plumber')
  , browserify = require('gulp-browserify')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename');


gulp.task('lint', function() {
    return gulp.src(['src/js/*.js', '!src/{lib,lib/**}'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('less', function() {
    return gulp.src('src/less/site.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});


gulp.task('browserify', function() {
    return gulp.src('src/js/start.js')
        .pipe(browserify({
            debug : true,
            transform: ['hbsfy']
        }))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('/public/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.src('src/**/*.js', { read: false })
        .pipe(watch())
        .pipe(plumber())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));

    gulp.watch('src/less/*.less', ['less']);
});

gulp.task('bootstrap', bootstrap);

// Default Task
gulp.task('default', ['lint', 'less', 'browserify', 'bootstrap']);