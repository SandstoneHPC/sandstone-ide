module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'client/oide/bower_components/angular/angular.js',
      'client/oide/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/oide/bower_components/angular-mocks/angular-mocks.js',
      'client/oide/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'client/oide/bower_components/ace-builds/src-min-noconflict/ace.js',
      'client/oide/bower_components/angular-ui-ace/ui-ace.js',
      'client/oide/bower_components/angular-tree-control/angular-tree-control.js',
      'client/oide/bower_components/angular-smart-table/dist/smart-table.js',
      'client/oide/bower_components/angular-file-upload/dist/angular-file-upload.js',
      'client/oide/bower_components/term.js/src/term.js',
      'client/oide/components/**/*.js',
      'client/oide/oide.test.js',
      'apps/codeeditor/static/editor.js',
      'apps/webterminal/static/terminal.js',
      'apps/filebrowser/static/filebrowser.js',
      'apps/**/static/*.js',
      // test files
      'client/oide/oide_test.js',
      'apps/**/tests/js/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
