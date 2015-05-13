'use strict';

angular.module('oide.vnc', ['ngRoute','ui.bootstrap','noVNC'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vnc', {
    templateUrl: '/static/vnc/vnc.html',
    controller: 'VncCtrl',
    resolve: {
      vncConfig: function (VncService) {
        return VncService.getVncConfig();
      }
    }
  });
}])

.factory('VncService', ['$http', function ($http) {
  return {
    getVncConfig: function () {
      return $http
        .get('/vnc/a/config')
        .success(function (data, status, headers, config) {
          return data;
        });
    }
  };
}])
.controller('VncCtrl', ['$scope', 'vncConfig', '$log', function($scope,vncConfig,$log) {
  $scope.vncConfig = vncConfig.data;
}]);
