angular.module('oide',[
    'ui.router',
    'oide.editor',
    'oide.terminal',
    'oide.acemodes',
    'ui.bootstrap'
  ])
.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/editor');
}])
.controller('PageCtrl', ['$location','PageService',function($location,PageService) {
  var self = this;
  self.currentUrl = PageService.getCurrentUrl;
}])
.factory('PageService', ['$location',function($location) {
  return {
    getCurrentUrl: function () {
      return '/#'+$location.path();
    }
  };
}]);
