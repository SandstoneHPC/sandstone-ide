'use strict';

angular.module('oide.terminal', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: '/static/terminal/terminal.html',
    controller: 'TerminalCtrl',
    resolve: {
      embedConfig: function (TerminalService) {
        return TerminalService.getEmbedConfig();
      }
    }
  });
}])

.factory('TerminalService', ['$http', function ($http) {
  return {
    getEmbedConfig: function () {
      return $http
        .get('/terminal/a/embed')
        .success(function (data, status, headers, config) {
          return data;
        });
    }
  };
}])
.controller('TerminalCtrl', ['$scope', 'embedConfig', '$sce', '$log', function($scope,embedConfig,$sce,$log) {
  $scope.embedUrl = $sce.trustAsResourceUrl(embedConfig.data.shellinabox_url);
}]);
