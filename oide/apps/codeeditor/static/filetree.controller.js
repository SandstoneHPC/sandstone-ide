'use strict';

angular.module('oide.editor')

.controller('FiletreeCtrl', ['$document', '$log', 'FiletreeService', function($document,$log,FiletreeService) {
  var self = this;
  self.treeData= FiletreeService.treeData;
  self.multiSelection = false;
  $document.on('keydown', (function (e) {
    if (e.keyCode === 17) {
      self.multiSelection = true;
    }
  }));
  $document.on('keyup', (function (e) {
    if (e.keyCode === 17) {
      self.multiSelection = false;
    }
  }));
  self.treeOptions = {
    multiSelection: true,
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
    if (self.multiSelection === false) {
      if (selected) {
        self.treeData.selectedNodes = [node];
      } else {
        self.treeData.selectedNodes = [];
      }
    }
    FiletreeService.describeSelection(node, selected);
  };
  self.getDirContents = function (node, expanded) {
    if(expanded) {
      FiletreeService.getDirContents(node);
    }
  };
  self.showSelected = function(node, selected) {
    console.log(node);
    console.log(selected);
  };
}]);
