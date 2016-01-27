'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    return $http.get('/a/deps').then(function(response) {
      var depList = ['ui.router'];
      for (var i=0;i<response.data.dependencies.length;i++) {
        depList.push('oide.'+response.data.dependencies[i]);
      }
      depList.push('oide.acemodes');
      depList.push('ui.bootstrap');
      depList.push('oide.filesystemservice');
      var oide = angular.module('oide', depList);

      oide.config(['$urlRouterProvider', function($urlRouterProvider) {
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

      angular.element(document).ready(function() {
        angular.bootstrap(document, ['oide']);
      });
    });
  }
}());
