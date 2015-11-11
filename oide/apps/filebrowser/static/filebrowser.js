'use strict';

angular.module('oide.filebrowser', ['smart-table'])

.config(['$stateProvider', '$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){
  $stateProvider.state('filebrowser', {
    url: '/filebrowser',
    views: {
      '': {
        templateUrl: '/static/filebrowser/filebrowser.html'
      },
      'filetree@filebrowser': {
        templateUrl: '/static/filebrowser/templates/filetree.html',
        controller: 'FiletreeController',
        controllerAs: 'ctrl'
      }
    }
  });
}]);
