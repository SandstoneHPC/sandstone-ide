'use strict';

angular.module('oide.filebrowser', ['smart-table'])

.config(['$stateProvider', '$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){
  $stateProvider.state('filebrowser', {
    url: '/filebrowser',
    views: {
      '': {
        templateUrl: '/static/filebrowser/filebrowser.html',
        controller: 'FilebrowserController',
        controllerAs: 'ctrl'
      },
      'filetree@filebrowser': {
        templateUrl: '/static/filebrowser/templates/filetree.html',
        controller: 'FiletreeController',
        controllerAs: 'ctrl'
      }
    }
  });
}])


.controller('FilebrowserController', [function(){
  var self = this;
  self.show_details = false;
  self.ShowDetails = function(){
    self.show_details = true;
  };
}]);
