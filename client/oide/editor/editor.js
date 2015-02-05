'use strict';

angular.module('oide.editor', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editor', {
    templateUrl: '/static/editor/editor.html',
    controller: 'EditorCtrl'
  });
}])

.controller('EditorCtrl', [function() {

}]);