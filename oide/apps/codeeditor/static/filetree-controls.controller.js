'use strict';

angular.module('oide.editor')

.controller('FiletreeControlCtrl', ['$scope', '$modal', '$log', 'FiletreeService', function($scope,$modal,$log,FiletreeService) {
  $scope.sd = FiletreeService.selectionDesc;
  $scope.fcDropdown = false;
  $scope.clipboardEmpty = FiletreeService.clipboardEmpty();
  $scope.updateFiletree = function () {
    FiletreeService.updateFiletree();
  };
  $scope.openFilesInEditor = function () {
    FiletreeService.openFilesInEditor();
  };
  $scope.createNewFile = function () {
    FiletreeService.createNewFile();
  };
  $scope.createNewDir = function () {
    FiletreeService.createNewDir();
  };
  $scope.createDuplicate = function () {
    FiletreeService.createDuplicate();
  };
  $scope.deleteFiles = function () {
    var deleteModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/delete-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'DeleteModalCtrl',
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
  $scope.copyFiles = function () {
    FiletreeService.copyFiles();
  };
  $scope.pasteFiles = function () {
    FiletreeService.pasteFiles();
  };
  $scope.renameFile = function () {
    var renameModalInstance = $modal.open({
      templateUrl: '/static/editor/templates/rename-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'RenameModalCtrl',
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
.controller('DeleteModalCtrl', function ($scope, $modalInstance, files) {

  $scope.files = files;

  $scope.remove = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('RenameModalCtrl', function ($scope, $modalInstance, files) {

  $scope.files = files;
  $scope.newFileName = files[0].filename;

  $scope.rename = function () {
    $modalInstance.close($scope.newFileName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
