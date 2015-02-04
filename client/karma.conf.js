module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'oide/bower_components/angular/angular.js',
      'oide/bower_components/angular-route/angular-route.js',
      'oide/bower_components/angular-mocks/angular-mocks.js',
      'oide/components/**/*.js',
      'oide/view*/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
