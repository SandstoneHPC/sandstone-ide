module.exports = function(config){
  config.set({

    files : %(file_list)s,

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
    preprocessors : {
      'components/filetreedirective/templates/filetree.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor : {
      stripPrefix: 'components/filetreedirective/templates/filetree.html',
      prependPrefix: '/static/core/components/filetreedirective/templates/filetree.html',
      moduleName: 'oide.templates'
    }

  });
};
