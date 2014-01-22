module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            'public/js/app.js' : 'src/js/start.js',
            options: {
                //debug: true,
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
                tasks: ['less'],
            },
        },
        less: {
            site: {
                files: {
                    'public/css/site.css': 'src/less/**/*.less'
                }    
            }    
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('build', ['browserify', 'less']);

};