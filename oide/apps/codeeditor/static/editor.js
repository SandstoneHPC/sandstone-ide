'use strict';

angular.module('oide.editor', ['ui.ace','treeControl'])

.config(['$stateProvider', '$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('editor', {
      url: '/editor',
      views: {
        '': {
          templateUrl: '/static/editor/editor.html'
        },
        'ace@editor': {
          templateUrl: '/static/editor/templates/ace.html',
          controller: 'AceCtrl as ctrl'
          // resolve: {
          //   stateLoaded: function(StateService) {
          //     return StateService.stateLoaded;
          //   }
          // }
        },
        'tabs@editor': {
          templateUrl: '/static/editor/templates/tabs.html',
          controller: 'EditorTabsCtrl as ctrl'
        },
        'settings@editor': {
          templateUrl: '/static/editor/templates/settings.html',
          controller: 'EditorSettingsCtrl as ctrl'
        },
        'filetree@editor': {
          templateUrl: '/static/editor/templates/filetree.html',
          controller: 'FiletreeCtrl as ctrl'
        },
        'filetreeControls@editor': {
          templateUrl: '/static/editor/templates/filetree-controls.html',
          controller: 'FiletreeControlCtrl as ctrl'
        }
      }
    });
}]);

