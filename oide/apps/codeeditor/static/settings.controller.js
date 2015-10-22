'use strict';

angular.module('oide.editor')

.controller('EditorSettingsCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  $scope.editorSettings = EditorService.editorSettings;
  // $scope.editorSettings.fontSize = 12;
  // $scope.editorSettings.tabSize = 4;
  var fontSizes = [];
  var tabSizes = [];
  for (var i=1;i<9;i++) { tabSizes.push(i); }
  for (var i=8;i<21;i+=2) { fontSizes.push(i); }
  $scope.fontOptions = fontSizes;
  $scope.tabOptions = tabSizes;

  $scope.applyEditorSettings = function () {
    EditorService.applyEditorSettings();
  };
}]);
