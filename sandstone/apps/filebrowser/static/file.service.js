'use strict';

angular.module('sandstone.filebrowser')

.factory('FileService', ['$rootScope', function($rootScope){
  var fileData;
  var currentDirectory = [];
  var root_dir = [];
  var volume_info;
  var selection = "";
  var setFileData = function(data) {
    fileData = data;
  };

  var getFileData = function(){
    return fileData;
  };

  var getCurrentDirectory = function() {
    return currentDirectory;
  };

  var getVolumeInfo = function() {
    return volume_info;
  };

  var setCurrentDirectory = function(filepath) {
    currentDirectory = filepath.split("/")
    // Current Directory Path should be '/'
    currentDirectory[0] = "/";
    // If last character is blank, splice it out
    if(currentDirectory[currentDirectory.length - 1] == "") {
      currentDirectory.splice(-1);
    }
  };

  var setRootDirectory = function(rootDirectory) {
    root_dir = rootDirectory.split("/")
    // Current Directory Path should be '/'
    root_dir[0] = "/";
    // If last component is blank, splice it out
    if(root_dir[root_dir.length - 1] == "") {
      root_dir.splice(-1);
    }
  };

  var setVolumeInfo = function(volumeInfo) {
    volume_info = volumeInfo;
  };

  var getRootDirectory = function() {
    return root_dir;
  };

  var setSelectionPath = function(path) {
    selection = path;
  };

  var getSelectionPath = function() {
    return selection;
  };

  return {
    setFileData: setFileData,
    getFileData: getFileData,
    setCurrentDirectory: setCurrentDirectory,
    getCurrentDirectory: getCurrentDirectory,
    setRootDirectory: setRootDirectory,
    getRootDirectory: getRootDirectory,
    setVolumeInfo: setVolumeInfo,
    getVolumeInfo: getVolumeInfo,
    setSelectionPath: setSelectionPath,
    getSelectionPath: getSelectionPath
  };
}]);
