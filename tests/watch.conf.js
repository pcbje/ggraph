var shared = require('./cover.conf.js');

module.exports = function(config) {
  shared(config);
  config.set({
    singleRun: false,
    autoWatch: true,
    reporters: ['coverage', 'spec'],
    coverageReporter: {
      reporters: [
        { type: 'html', dir: 'coverage', subdir: '.' },
      ]
    }
  });
};
