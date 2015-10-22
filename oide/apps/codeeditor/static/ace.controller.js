'use strict';

angular.module('oide.editor')

.controller('AceCtrl', ['$scope', 'EditorService', '$location', 'StateService',
  function($scope, EditorService, $location, StateService) {
    var self = this;
    self.onAceLoad = function(_ace) {
      EditorService.onAceLoad(_ace);
    };
    self.noOpenSessions = function() {
      return EditorService.getOpenDocs().length === 0;
    };
  }]);
