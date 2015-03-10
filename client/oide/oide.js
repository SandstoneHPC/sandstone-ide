'use strict';

// Declare app level module which depends on views, and components
angular.module('oide', [
  'ngRoute',
  'ui.bootstrap',
  'oide.editor',
  'oide.acemodes',
  'oide.states'
  // 'oide.terminal',
  // 'oide.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/editor'});
}])
.run(
  function (StateService,$log) {
    $log.debug('StateService initialized.');
  }
);
