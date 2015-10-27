'use strict';

angular.module('oide.editor')

.controller('EditorTabsCtrl', ['$scope', '$modal', '$log', 'EditorService', 'FiletreeService',
  function ($scope, $modal, $log, EditorService, FiletreeService) {
    var self = this;
    self.getOpenDocs = function() {
      return EditorService.getOpenDocs();
    };
    self.openDocument = function (filepath) {
      var fp = filepath || undefined;
      EditorService.openDocument(fp);
    };
    self.closeDocument = function ($event, tab) {
      $event.preventDefault();
      if (tab.unsaved) {
        var unsavedModalInstance = $modal.open({
          templateUrl: '/static/editor/templates/close-unsaved-modal.html',
          backdrop: 'static',
          keyboard: false,
          controller: 'UnsavedModalCtrl',
          resolve: {
            file: function () {
              return tab;
            }
          }
        });
  
        unsavedModalInstance.result.then(function (file) {
          if (file.saveFile) {
            if (tab.filepath.substring(0,2) !== '-/') {
              EditorService.saveDocument(file.filepath);
              $log.debug('Saved files at: ' + new Date());
              EditorService.closeDocument(file.filepath);
            } else {
              self.saveDocumentAs(file);
            }
          } else {
            $log.debug('Closed without saving at: ' + new Date());
            EditorService.closeDocument(file.filepath);
          }
        }, function () {
          $log.debug('Modal dismissed at: ' + new Date());
        });
      } else {
        EditorService.closeDocument(tab.filepath);
      }
    };
    self.saveDocumentAs = function (tab) {
      var saveAsModalInstance = $modal.open({
        templateUrl: '/static/editor/templates/saveas-modal.html',
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
        controller: 'SaveAsModalCtrl',
        resolve: {
          file: function () {
            return tab;
          }
        }
      });
  
      saveAsModalInstance.result.then(function (newFile) {
        EditorService.fileRenamed(newFile.oldFilepath,newFile.filepath);
        EditorService.saveDocument(newFile.filepath);
        FiletreeService.updateFiletree();
        $log.debug('Saved files at: ' + new Date());
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });
    };
    self.saveDocument = function (tab) {
      EditorService.saveDocument(tab.filepath);
    };
    self.undoChanges = function (tab) {
      EditorService.undoChanges(tab.filepath);
    };
    self.redoChanges = function (tab) {
      EditorService.redoChanges(tab.filepath);
    };
    self.copySelection = function () {
      EditorService.copySelection();
    };
    self.cutSelection = function () {
      EditorService.cutSelection();
    };
    self.pasteClipboard = function () {
      EditorService.pasteClipboard();
    };
    self.commentSelection = function () {
      EditorService.commentSelection();
    };
    self.openSearchBox = function () {
      EditorService.openSearchBox();
    };
  }])
.controller('SaveAsModalCtrl', function ($scope, $modalInstance, $http, file) {
  $scope.treeData = {};
  var initialContents = $http
    .get('/filebrowser/filetree/a/dir')
    .success(function(data, status, headers, config) {
      for (var i=0;i<data.length;i++) {
        data[i].children = [];
      }
      $scope.treeData.filetreeContents = data;
    }).
    error(function(data, status, headers, config) {
      $log.error('Failed to initialize filetree.');
    });
    $scope.getDirContents = function (node,expanded) {
      $http
        .get('/filebrowser/filetree/a/dir', {
          params: {
            dirpath: node.filepath
          }
        }).
        success(function(data, status, headers, config) {
          for (var i=0;i<data.length;i++) {
            if (!data[i].hasOwnProperty('children')) {
              data[i].children = [];
            }
          }
          node.children = data;
        }).
        error(function(data, status, headers, config) {
          $log.error('Failed to grab dir contents from ',node.filepath);
        });
  };
  $scope.newFile = {};
  $scope.invalidFilepath = false;
  if (file.filepath.substring(0,1) === '-') {
    $scope.newFile.filepath = '-/';
    $scope.invalidFilepath = true;
  } else {
    var index = file.filepath.lastIndexOf('/')+1;
    var filepath = file.filepath.substring(0,index);
    $scope.newFile.filepath = filepath;
  }
  $scope.newFile.filename = file.filename;
  $scope.newFile.oldFilename = file.filename;
  $scope.newFile.oldFilepath = file.filepath;
  $scope.updateSaveName = function (node, selected) {
    $scope.invalidFilepath = false;
    if (node.type === 'dir') {
      $scope.newFile.filepath = node.filepath;
    } else {
      var index = node.filepath.lastIndexOf('/')+1;
      var filepath = node.filepath.substring(0,index);
      var filename = node.filepath.substring(index,node.filepath.length);
      $scope.newFile.filepath = filepath;
      $scope.newFile.filename = filename;
    }
  };
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

  $scope.saveAs = function () {
    $scope.newFile.filepath = $scope.newFile.filepath+$scope.newFile.filename;
    $modalInstance.close($scope.newFile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('UnsavedModalCtrl', function ($scope, $modalInstance, file) {

  $scope.file = file;

  $scope.save = function () {
    $scope.file.saveFile = true;
    $modalInstance.close($scope.file);
  };

  $scope.close = function () {
    $scope.file.saveFile = false;
    $modalInstance.close($scope.file);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

