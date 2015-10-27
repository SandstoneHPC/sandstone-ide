'use strict';

angular.module('oide.editor')

.controller('EditorSettingsCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  var self =  this;
  self.editorSettings = EditorService.getSettings();
  var fontSizes = [];
  var tabSizes = [];
  var i;
  for (i=1;i<9;i++) { tabSizes.push(i); }
  for (i=8;i<21;i+=2) { fontSizes.push(i); }
  self.fontOptions = fontSizes;
  self.tabOptions = tabSizes;

  self.applyEditorSettings = function () {
    EditorService.setSettings(self.editorSettings);
  };
}]);
