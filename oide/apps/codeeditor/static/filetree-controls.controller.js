'use strict';

angular.module('oide.editor')

.controller('FiletreeControlCtrl', ['$modal', '$log', 'FiletreeService', 'EditorService', '$rootScope', function($modal,$log, FiletreeService, EditorService, $rootScope) {
  var self = this;
  self.sd = FiletreeService.selectionDesc;
  self.fcDropdown = false;
  self.clipboardEmpty = function(){
    return FiletreeService.clipboardEmpty();
  };
  self.updateFiletree = function () {
    FiletreeService.updateFiletree();
  };

  self.openFilesInEditor = function () {
    //FiletreeService.openFilesInEditor();
    var treeData = FiletreeService.openFilesInEditor();
    for(var i = 0; i < treeData.length; i++) {
      EditorService.openDocument(treeData[i].filepath);
      $log.debug('Opened document: ', treeData[i].filepath);
    }
  };
  self.createNewFile = function () {
    FiletreeService.createNewFile();
  };
  self.createNewDir = function () {
    FiletreeService.createNewDir();
  };
  self.createDuplicate = function () {
    FiletreeService.createDuplicate();
  };

  $rootScope.$on('fileRenamed',function(event, oldPath, newPath){
    EditorService.fileRenamed(oldPath, newPath);
  });

  $rootScope.$on('fileDeleted', function(event, path){
    EditorService.fileDeleted(path);
  });

  self.deleteFiles = function () {
    var deleteModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/delete-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'DeleteModalCtrl as ctrl',
      resolve: {
        files: function () {
          return FiletreeService.treeData.selectedNodes;
        }
      }
    });

    deleteModalInstance.result.then(function () {
      $log.debug('Files deleted at: ' + new Date());
      FiletreeService.deleteFiles();
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };
  self.copyFiles = function () {
    FiletreeService.copyFiles();
  };
  self.pasteFiles = function () {
    FiletreeService.pasteFiles();
  };
  self.renameFile = function () {
    var renameModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/rename-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'RenameModalCtrl as ctrl',
      resolve: {
        files: function () {
          return FiletreeService.treeData.selectedNodes;
        }
      }
    });

    renameModalInstance.result.then(function (newFileName) {
      $log.debug('Files renamed at: ' + new Date());
      FiletreeService.renameFile(newFileName);
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };
}])
.controller('DeleteModalCtrl', function ($modalInstance, files) {
  var self =  this;
  self.files = files;

  self.remove = function () {
    $modalInstance.close();
  };

  self.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('RenameModalCtrl', function ($modalInstance, files) {
  var self = this;
  self.files = files;
  self.newFileName = files[0].filename;

  self.rename = function () {
    $modalInstance.close(self.newFileName);
  };

  self.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
