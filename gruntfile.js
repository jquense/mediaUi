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
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('build', ['browserify']);

};