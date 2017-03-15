'use strict';

angular.module('sandstone.filebrowser')

.service('FilebrowserService', ['$rootScope', 'FilesystemService', function($rootScope,FilesystemService){
  var self = this;

  // Selection Info
  var selectionInfo = {
    // Current Working Directory
    cwd: undefined,
    // Currently selected file
    selectedFile: undefined,
    // Currently selected volume (defined by cwd)
    volume: undefined
  };

  self.getSelection = function() {
    return selectionInfo;
  };

  self.setSelectedFile = function(selectedFile) {
    var file = selectedFile || undefined;
    selectionInfo.selectedFile = file;
  };

  self.setCwd = function(filepath) {
    // Load contents for CWD
    var cwdDetails = FilesystemService.getDirectoryDetails(
      filepath,
      {
        contents: true
      }
    );
    cwdDetails.then(function(dirDetails) {
      selectionInfo.cwd = dirDetails;
    });
  };

  self.setVolume = function(volume) {
    selectionInfo.volume = volume;
    self.setCwd(volume.filepath);
  };

  // Volume and Filesystem
  var filesystem = {};

  self.getFilesystem = function() {
    return filesystem;
  };

  var fsDetails = FilesystemService.getFilesystemDetails();
  fsDetails.then(
    function(filesystemDetails) {
      filesystem = filesystemDetails;
    }
  );

}]);
