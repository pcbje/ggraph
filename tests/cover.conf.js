'use strict';

module.exports = function (config) {
  config.set({
    basePath: '..',
    logLevel: config.LOG_INFO,
    frameworks: ['jasmine'],
    singleRun: true,
    files: [
      "https://d3js.org/d3.v4.min.js",
      'ext/simmelian.js',
      'src/*/*.js',
      'src/ggraph.js',
      'tests/ext/simmelian.js',
      'tests/*/*.js',
      'tests/ggraph.spec.js'
    ],
    exclude: [],
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcovonly', dir: 'coverage', subdir: '.', file: 'lcov.info' },
      ]
    },
    preprocessors: {
      'src/**/*.js': ['coverage']
    }
  })
};
