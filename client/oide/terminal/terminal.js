'use strict';

angular.module('oide.terminal', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: '/static/terminal/terminal.html',
    controller: 'TerminalCtrl'
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
      
    });
}]);
