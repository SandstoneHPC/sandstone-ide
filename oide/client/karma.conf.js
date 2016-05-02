var env = require('./karma.environment.js');

module.exports = function(config){
  config.set({

    files : env.fileList,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-ng-html2js-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    preprocessors : env.preprocessors,
    ngHtml2JsPreprocessor : {
      cacheIdFromPath: function(filepath) {
        console.log(filepath);
        var path;
        for (var pfx in env.pathMap) {
          console.log('prefix: '+pfx);
          if (filepath.startsWith(pfx)) {
            path = filepath.replace(
              pfx,
              env.pathMap[pfx]
            );
            return path;
          }
        }
        return filepath;
      },
      moduleName: 'oide.templates'
    }

  });
};
