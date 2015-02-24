'use strict';

// Declare app level module which depends on views, and components
angular.module('oide', [
  'ngRoute',
  'ui.bootstrap',
  'oide.editor'
  // 'oide.terminal',
  // 'oide.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/editor'});
}]);
