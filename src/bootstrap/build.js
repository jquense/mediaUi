/* jshint node: true */

module.exports = {
    // Metadata.

    bsBanner: '/*!\n' +
              ' * Bootstrap v3.0.2 by @fat and @mdo\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> Twitter, Inc.\n' +
              ' * Licensed under http://www.apache.org/licenses/LICENSE-2.0 \n' +
              ' *\n' +
              ' * Designed and built with all the love in the world by @mdo and @fat.\n' +
              ' */\n\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',

    concat: {
      options: {
        banner: '<%= bsBanner %><%= jqueryCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
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
        ],
        dest: 'public/js/bootstrap.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= bsBanner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'public/js/bootstrap.min.js'
      }
    },
    less: {
        bootstrap: {
            files: {
                'public/css/bootstrap.css': ['src/bootstrap/less/bootstrap.less']
            }    
        },
    },

    watch: {
        bootstrapCss: {
            files: 'src/bootstrap/less/*.less',
            tasks: 'less:bootstrap'
        }
    },
};
