var _ = require('lodash');

module.exports = function(grunt) {
    var bootstrap = require('./src/bootstrap/build.js')
      , project = {
            pkg: grunt.file.readJSON('package.json'),

            browserify: {
                'public/js/app.js' : 'src/js/start.js',
                options: {
                    debug: true,
                    transform: [ 'hbsfy']
                }
            },
            watch: {
                browserify: {
                    files: ['src/**/*.js', 'src/**/*.hbs'],
                    tasks: ['browserify'],
                },
                css: {
                    files: 'src/less/**/*.less',
                    tasks: ['less:site'],
                },
            },
            less: {
                site: {
                    files: {
                        'public/css/site.css': 'src/less/**/site.less'
                    }    
                }    
            }
        };

    grunt.initConfig(_.merge(project, bootstrap));

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('bootstrap', ['concat:bootstrap', 'uglify:bootstrap', 'less:bootstrap']);

    grunt.registerTask('project', ['browserify', 'less:site']);

    grunt.registerTask('build', ['bootstrap', 'project']);

};