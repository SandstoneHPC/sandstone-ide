module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'oide/bower_components/angular/angular.js',
      'oide/bower_components/angular-route/angular-route.js',
      'oide/bower_components/angular-mocks/angular-mocks.js',
      'oide/bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.12.0.min.js',
      'oide/bower_components/ace-builds/src-min-noconflict/ace.js',
      'oide/bower_components/angular-ui-ace/ui-ace.js',
      'oide/bower_components/angular-tree-control/angular-tree-control.js',
      'oide/editor/**/*.js',
      'oide/terminal/**/*.js'
      // 'oide/components/**/*.js',
      // 'oide/view*/**/*.js'
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
