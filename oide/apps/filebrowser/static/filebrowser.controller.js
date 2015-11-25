'use strict';

angular.module('oide.filebrowser')
.controller('FilebrowserController', ['FBFiletreeService', '$rootScope', 'FileService', '$scope', function(FiletreeService, $rootScope, FileService, $scope){
  var self = this;

  $scope.$watch(function(){
      return FileService.getFileData();
    }, function (newValue) {
    self.fileData = newValue;
  });

  $scope.$watch(function(){
      return FileService.getCurrentDirectory();
    }, function (newValue) {
    self.currentDirectory = newValue;
  });

  self.show_details = false;
  self.ShowDetails = function(selectedFile){
    self.selectedFile = selectedFile.filename;
    self.selectedFileOwner = selectedFile.owner
    self.show_details = true;
    self.currentFileSize = selectedFile.size
  };
}])
.factory('FileService', ['$rootScope', function($rootScope){
  var fileData;
  var currentDirectory = [];
  var setFileData = function(data) {
    fileData = data;
    // $rootScope.$apply();
  };

  var getFileData = function(){
    return fileData;
  };

  var getCurrentDirectory = function() {
    return currentDirectory;
  };

  var setCurrentDirectory = function(filepath) {
    currentDirectory = filepath.split("/")
    // Current Directory Path should be '/'
    currentDirectory[0] = "/";
    // Last component will be blank and needs to be spliced
    currentDirectory.splice(-1)
  };

  return {
    setFileData: setFileData,
    getFileData: getFileData,
    setCurrentDirectory: setCurrentDirectory,
    getCurrentDirectory: getCurrentDirectory
  };
}]);
