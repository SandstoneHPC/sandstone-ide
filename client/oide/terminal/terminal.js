'use strict';

angular.module('oide.terminal', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: '/static/terminal/terminal.html'
  });
}])

.controller('TerminalCtrl', ['$scope', '$window', '$http', '$log', function($scope,$window,$http,$log) {
  var embedConfig;
  $http
    .get('/terminal/a/embed')
    .success(function (data, status, headers, config) {
      embedConfig = data;
    })
    .then(function () {
      GateOne.init({
          url: embedConfig.gateone_url,
          auth: embedConfig.authobj,
          origins: embedConfig.gateone_origins_url,
          theme: 'white',
          showTitle: false,
          showToolbar: true
      });
    });
}]);
