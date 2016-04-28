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
      'components/filetreedirective/templates/filetree.html': 'ng-html2js',
      'apps/**/templates/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor : {
      cacheIdFromPath: function(filepath) {
        var cacheId = filepath.split("/")[0]
        if(cacheId == "components") {
          return "/static/core/" + filepath;
        } else if(cacheId == "apps") {
          var path = "/static/" + filepath.replace("/static", "").replace("apps/", "");
          return path;
        }
        return filepath;
      },
      moduleName: 'oide.templates'
    }

  });
};
