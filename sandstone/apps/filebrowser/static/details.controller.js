'use strict';

angular.module('sandstone.filebrowser')

.controller('DetailsCtrl', ['$scope', '$modal', 'FilebrowserService', 'FilesystemService', function($scope,$modal,FilebrowserService,FilesystemService) {
  var self = this;

  self.breadcrumbs = [];

  var setBreadcrumbs = function() {
    if (!self.selection.volume) {
      // No volume selected yet
      self.breadcrumbs = [];
    } else if(!self.selection.cwd) {
      // Only a volume is selected
      self.breadcrumbs = [self.selection.volume.filepath];
    } else {
      var crumbs = [];
      var volPath = FilesystemService.normalize(self.selection.volume.filepath);
      var cwdPath = FilesystemService.normalize(self.selection.cwd.filepath);
      var crumbPath = FilesystemService.normalize(cwdPath.replace(volPath,''));
      crumbs.push(volPath);
      var crumbCmps = FilesystemService.split(crumbPath).slice(1);
      for (var i=0; i<crumbCmps.length; i++) {
        self.breadcrumbs.push(crumbCmps[i]);
      }
    }
  };

  self.selection = {};
  $scope.$watch(function() {
    return FilebrowserService.getSelection();
  }, function(newValue) {
    self.selection = newValue;
    setBreadcrumbs();
  },true);

  // Directory Details
  self.openDirectory = function(file) {
    if (file.type === 'file') {
      self.selectFile(file);
    } else {
      FilebrowserService.setCwd(file.filepath);
    }
  };

  self.selectFile = function(file) {
    FilebrowserService.setSelectedFile(file);
  };

  self.changeDirectory = function(filepath) {
    FilebrowserService.setCwd(filepath);
  };

  self.create = function(type) {
    var createModalInstance = $modal.open({
      templateUrl: '/static/filebrowser/templates/create-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'CreateModalInstanceCtrl as ctrl',
      resolve: {
        action: function () {
          return {
            type: type,
            baseDirectory: self.selection.cwd,
            filename: 'Untitled'
          };
        }
      }
    });

    createModalInstance.result.then(function (newFileName) {
      var newPath = FilesystemService.join(self.selection.cwd.filepath,newFileName);

      var createReq;
      var setSelection = function(filepath) {
        FilebrowserService.setSelection({
          cwd: self.selection.cwd,
          selectedFile: self.selection.selectedFile
        });
      };
      if (type === 'file') {
        createReq = FilesystemService.createFile(newPath);
        createReq.then(setSelection);
      } else {
        createReq = FilesystemService.createDirectory(newPath);
        createReq.then(setSelection);
      }
    });
  };

  self.upload = function() {
    var modalInstance = $modal.open({
      templateUrl: '/static/filebrowser/templates/upload-modal.html',
      controller: 'UploadModalInstanceCtrl as ctrl',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        directory: function () {
          return self.selection.cwd;
        }
      }
    });

    modalInstance.result.then(function() {
      FilebrowserService.setSelection({
        cwd: self.selection.cwd
      });
    });
  };

}]);
