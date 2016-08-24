function getSandstoneModule(depList) {
  return angular.module('sandstone', depList)
    .config(['$urlRouterProvider', function($urlRouterProvider) {
      $urlRouterProvider.otherwise('/editor');
    }])
    .controller('PageCtrl', ['$location','PageService',function($location,PageService) {
      var self = this;
      self.currentUrl = PageService.getCurrentUrl;
    }])
    .run(
        function initializeServices(EditorService) {
            //Initializes the services
            // Dummy Method
        }
    )
    .factory('PageService', ['$location',function($location) {
      return {
        getCurrentUrl: function () {
          return '/#'+$location.path();
        }
      };
    }]);
}
