'use strict';

angular.module('oide.filebrowser')

.controller('FiletreeController', ['$document', '$log', 'FBFiletreeService', function($document,$log,FiletreeService) {
  var self = this;
  self.treeData= FiletreeService.treeData;
  $document.on('keydown', (function (e) {
    if (e.keyCode === 17) {
      self.treeOptions.multiSelection = true;
    }
  }));
  $document.on('keyup', (function (e) {
    if (e.keyCode === 17) {
      self.treeOptions.multiSelection = false;
    }
  }));
  self.treeOptions = {
    multiSelection: false,
    isLeaf: function(node) {
      return node.type !== 'dir';
    },
    injectClasses: {
      iExpanded: "filetree-icon fa fa-folder-open",
      iCollapsed: "filetree-icon fa fa-folder",
      iLeaf: "filetree-icon fa fa-file",
    }
  };
  self.describeSelection = function (node, selected) {
    if (self.treeOptions.multiSelection === false) {
      if (selected) {
        self.treeData.selectedNodes = [node];
      } else {
        self.treeData.selectedNodes = [];
      }
    }
    FiletreeService.describeSelection(node, selected);
  };
  self.getDirContents = function (node, expanded) {
    FiletreeService.getDirContents(node);
  };
  self.showSelected = function(node, selected) {
    console.log(node);
    console.log(selected);
  };
}]);
