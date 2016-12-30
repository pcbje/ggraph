module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/ggraph.min.css': ['dist/ggraph.css']
        }
      }
    },
    concat: {
      js: {
        src: [
          'src/marker/*.js',
          'src/algorithms/*.js',
          'src/modify/*.js',
          'src/modules/*.js',
          'src/ggraph.js'
        ],
        dest: 'dist/ggraph.js'
      },
      css: {
        src: ['src/*.css'],
        dest: 'dist/ggraph.css'
      },
    },
    uglify: {
      options: {
        mangle: false
      },
      ggraph: {
        files: {
          'dist/ggraph.min.js': ['dist/ggraph.js']
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('min', ['concat', 'uglify', 'cssmin']);
};
