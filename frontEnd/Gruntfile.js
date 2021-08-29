module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/script.js',
        dest: 'js/script.min.js'
      }
    }, //uglify
    sass: {                              // Task
      dist: {                            // Target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {                         // Dictionary of files
          'css/style.css': 'sass/style.scss',       // 'destination': 'source'

        }
      }
    },//sass

  // htmllint: {
  //   all: {
  //     src:'index.html'
  //   }
  // },
  jshint: {
    all: ['Gruntfile.js', 'js/script.js']
  },

    watch: {
      scripts: {
        files: ['js/script.js','sass/style.scss','index.html','Gruntfile.js'],
        tasks: ['uglify','sass','jshint'],
        options: {
          spawn: false,
    },


  },

},
  }); //initConfig

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  // grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['sass','jshint','watch']);
    grunt.registerTask('prod', ['uglify']);

};
