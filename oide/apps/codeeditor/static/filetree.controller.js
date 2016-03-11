'use strict';

angular.module('oide.editor')
.controller('FiletreeCtrl', ['$modal', '$log', 'EditorService', '$rootScope', 'FilesystemService', function($modal,$log, EditorService, $rootScope, FilesystemService){
  var self = this;
  self.treeData = {
    filetreeContents: [
      // { "type": "dir", "filepath": "/tmp/", "filename" : "tmp", "children" : []}
    ]
  };

  self.sd = {
    noSelections: true,
    multipleSelections: false,
    dirSelected: false
  };

  self.fcDropdown = false;
  self.clipboard = [];
  self.clipboardEmpty = function(){
    return self.clipboard.length === 0;
  };

  self.updateFiletree = function () {
    // for (var i=0;i<self.treeData.expandedNodes.length;i++) {
    //   self.getDirContents(self.treeData.expandedNodes[i]);
    // }
    $rootScope.$emit('refreshFiletree');
  };

  self.openFilesInEditor = function () {
    //FiletreeService.openFilesInEditor();
    var treeData = self.treeData.selectedNodes;
    for(var i = 0; i < treeData.length; i++) {
      EditorService.openDocument(treeData[i].filepath);
      $log.debug('Opened document: ', treeData[i].filepath);
    }
  };

  // Callback of invocation to FilesystemService to create a file
  // Update the filetree to show the new file
  self.createFileCallback = function(data, status, headers, config){
    $log.debug('POST: ', data);
    $rootScope.$emit('refreshFiletree');
  };

  // Callback of invocation to FilesystemService to get the next Untitled FIle
  // Invoke the FilesystemService to create the new file
  self.gotNewUntitledFile = function(data, status, headers, config) {
    $log.debug('GET: ', data);
    var newFilePath = data.result;
    // Post back new file to backend
    FilesystemService.createNewFile(newFilePath, self.createFileCallback);
  };

  self.createNewFile = function () {
    //Invokes filesystem service to create a new file
    var selectedDir = self.treeData.selectedNodes[0].filepath;
    FilesystemService.getNextUntitledFile(selectedDir, self.gotNewUntitledFile);
  };
  self.createNewDir = function () {
    var selectedDir = self.treeData.selectedNodes[0].filepath;
    FilesystemService.getNextUntitledDir(selectedDir, self.gotNewUntitledDir);
  };
  self.createDuplicate = function () {
    var selectedFile = self.treeData.selectedNodes[0].filepath;
    FilesystemService.getNextDuplicate(selectedFile, self.gotNextDuplicateFile);
  };

  $rootScope.$on('fileRenamed',function(event, oldPath, newPath){
    EditorService.fileRenamed(oldPath, newPath);
  });

  $rootScope.$on('fileDeleted', function(event, path){
    EditorService.fileDeleted(path);
  });

  self.deletedFile = function(data, status, headers, config, node) {
    $rootScope.$emit('deletedFile', data, status, headers, config, node);
  };

  self.deleteFiles = function () {
    var deleteModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/delete-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'DeleteModalCtrl as ctrl',
      resolve: {
        files: function () {
          return self.treeData.selectedNodes;
        }
      }
    });

    deleteModalInstance.result.then(function () {
      $log.debug('Files deleted at: ' + new Date());
      for (var i=0;i<self.treeData.selectedNodes.length;i++) {
        var filepath = self.treeData.selectedNodes[i].filepath;
        FilesystemService.deleteFile(filepath, self.deletedFile);
      }
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };
  self.copyFiles = function () {
    var node, i;
    for (i=0;i<self.treeData.selectedNodes.length;i++) {
      node = self.treeData.selectedNodes[i]
      self.clipboard.push({
        'filename': node.filename,
        'filepath': node.filepath
      });
    }
    $log.debug('Copied ', i, ' files to clipboard: ', self.clipboard);
  };
  self.pasteFiles = function () {
    var i;
    var newDirPath = self.treeData.selectedNodes[0].filepath;
    for (i=0;i<self.clipboard.length;i++) {
      FilesystemService.pasteFile(self.clipboard[i].filepath, newDirPath + self.clipboard[i].filename, self.pastedFiles);
    }
    self.clipboard = [];
    if (!self.isExpanded(newDirPath)) {
      var node = self.getNodeFromPath(newDirPath,self.treeData.filetreeContents);
      self.treeData.expandedNodes.push(node);
    }
    self.updateFiletree();
  };
  self.renameFile = function () {
    var renameModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/rename-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'RenameModalCtrl as ctrl',
      resolve: {
        files: function () {
          return self.treeData.selectedNodes;
        }
      }
    });

    renameModalInstance.result.then(function (newFileName) {
      $log.debug('Files renamed at: ' + new Date());
      var node = self.treeData.selectedNodes[0];
      FilesystemService.renameFile(newFileName, node, self.fileRenamed);
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };


}]);
