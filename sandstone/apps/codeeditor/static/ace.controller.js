'use strict';

angular.module('sandstone.editor')

.controller('AceCtrl', ['$scope', 'EditorService', '$location',
  function($scope, EditorService, $location, StateService) {
    var self = this;
    self.onAceLoad = function(_ace) {
      EditorService.onAceLoad(_ace);
    };
    self.noOpenSessions = function() {
      return Object.keys(EditorService.getOpenDocs()).length === 0;
    };
  }]);
