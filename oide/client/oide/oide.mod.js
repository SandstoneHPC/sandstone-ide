function getOideModule(depList) {
  return angular.module('oide', depList)
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
}
