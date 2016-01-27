'use strict';

angular.module('oide.filebrowser')

.controller('FiletreeController', ['$document', '$log', 'FBFiletreeService', 'FilesystemService', 'FileService', '$scope', function($document,$log,FiletreeService, FilesystemService, FileService, $scope) {
  var self = this;
  self.treeData= FiletreeService.treeData;
  self.multiSelection = false;
  $scope.$watch(function(){
      return FileService.getSelectionPath();
    }, function (newValue) {
      if(newValue == "") {
        return;
      }
      self.describeSelection({'filepath': newValue, 'type': 'dir'}, true);
  });

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
  self.gotFiles = function(data, status, headers, config) {
    FileService.setFileData(data);
  };
  self.gotRootDirectory = function(data, status, headers, config) {
    var rootDirectory = data.result;
    FileService.setRootDirectory(rootDirectory);
  };

  self.gotVolumeInfo = function(data, status, headers, config) {
    var volumeInfo = data.result;
    FileService.setVolumeInfo(volumeInfo);
  };

  self.describeSelection = function (node, selected) {
    if (self.multiSelection === false) {
      if (selected) {
        self.treeData.selectedNodes = [node];
        // Set the current directory
        FileService.setCurrentDirectory(node.filepath);
        // Get the list of files from FilesystemService
        FilesystemService.getFiles(node, self.gotFiles);
        // Get Root Directory
        FilesystemService.getRootDirectory(node.filepath, self.gotRootDirectory);
        FilesystemService.getVolumeInfo(node.filepath, self.gotVolumeInfo);
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
