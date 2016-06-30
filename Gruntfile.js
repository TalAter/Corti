module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'src/corti.js',
        'test/spec/**.js'
      ],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files: ['src/corti.js', 'test/spec/**.js', '!**/node_modules/**'],
      tasks: ['default']
    },
    jasmine: {
      testAndCoverage: {
        src: ['src/corti.js'],
        options: {
          specs: ['test/spec/*Spec.js'],
          outfile: 'test/SpecRunner.html',
          keepRunner: false,
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'test/coverage/coverage.json',
            report: [
              {
                type: 'html',
                options: {
                  dir: 'test/coverage'
                }
              },
              {
                type: 'text'
              }
            ],
            thresholds: {
              lines: 99,
              statements: 99,
              branches: 99,
              functions: 99
            }
          }
        }
      }
    },
    browserAMD: {
      src: ['src/corti.js'],
      options: {
        specs: 'test/spec/*Spec.js',
        outfile: 'test/SpecRunner.html',
        //vendor: ['test/vendor/corti.js', 'test/init_corti.js'], // https://github.com/cloudchen/grunt-template-jasmine-requirejs/issues/72
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfig: {
            baseUrl: '../'
          }
        }
      }
  });

  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jasmine']);

  // Test task
  grunt.registerTask('test', ['jshint', 'jasmine']);

};
