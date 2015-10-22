'use strict';

angular.module('oide.editor')

.controller('FiletreeCtrl', ['$scope', '$document', '$log', 'FiletreeService', function($scope,$document,$log,FiletreeService) {
  $scope.treeData= FiletreeService.treeData;
  $document.on('keydown', (function (e) {
    if (e.keyCode === 17) {
      $scope.treeOptions.multiSelection = true;
    }
  }));
  $document.on('keyup', (function (e) {
    if (e.keyCode === 17) {
      $scope.treeOptions.multiSelection = false;
    }
  }));
  $scope.treeOptions = {
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
  $scope.describeSelection = function (node, selected) {
    if ($scope.treeOptions.multiSelection === false) {
      if (selected) {
        $scope.treeData.selectedNodes = [node];
      } else {
        $scope.treeData.selectedNodes = [];
      }
    }
    FiletreeService.describeSelection(node, selected);
  };
  $scope.getDirContents = function (node, expanded) {
    FiletreeService.getDirContents(node);
  };
  $scope.showSelected = function(node, selected) {
    console.log(node);
    console.log(selected);
      // $scope.selectedNodes = selected;
  };
}]);
