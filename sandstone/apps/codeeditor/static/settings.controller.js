'use strict';

angular.module('sandstone.editor')

.controller('EditorSettingsCtrl', ['$scope', 'EditorService', 'AceModeService', '$rootScope', function ($scope, EditorService, AceModeService, $rootScope) {
  var self =  this;
  self.editorSettings = EditorService.getSettings();
  var fontSizes = [];
  var tabSizes = [];
  var i;
  for (i=1;i<9;i++) { tabSizes.push(i); }
  for (i=8;i<21;i+=2) { fontSizes.push(i); }
  self.fontOptions = fontSizes;
  self.tabOptions = tabSizes;
  var modes = AceModeService.getSupportedModes();
  self.aceModes = [];
  for(var mode in modes) {
    self.aceModes.push(mode);
  }

  $rootScope.$on('aceModeChanged', function(e, mode){
    self.aceMode = mode.caption;
  });

  self.setAceMode = function() {
    var mode = AceModeService.getModeByName(self.aceMode.toLowerCase());
    EditorService.setAceMode(mode);
  };

  self.applyEditorSettings = function () {
    EditorService.setSettings(self.editorSettings);
  };
}]);
