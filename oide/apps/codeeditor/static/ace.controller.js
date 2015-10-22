'use strict';

angular.module('oide.editor')

.controller('AceCtrl', ['$scope', 'EditorService', '$location', 'StateService', 'stateLoaded', function($scope, EditorService, $location, StateService, stateLoaded) {
  $scope.aceModel = EditorService.aceModel;
  $scope.onAceLoad = function(_ace) {
    EditorService.onAceLoad(_ace);
  };
  $scope.noOpenSessions =  EditorService.noOpenSessions;
}]);
