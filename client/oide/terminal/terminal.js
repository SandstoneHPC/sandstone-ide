'use strict';

angular.module('oide.terminal', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: '/static/terminal/terminal.html',
    controller: 'TerminalCtrl'
  });
}])

.controller('TerminalCtrl', [function() {

}]);