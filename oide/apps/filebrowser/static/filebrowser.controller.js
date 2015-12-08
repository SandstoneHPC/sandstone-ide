'use strict';

angular.module('oide.filebrowser')
.controller('FilebrowserController', ['FBFiletreeService', '$rootScope', 'FileService', '$scope', 'FilesystemService', function(FiletreeService, $rootScope, FileService, $scope, FilesystemService){
  var self = this;

  $scope.$watch(function(){
      return FileService.getFileData();
    }, function (newValue) {
    self.fileData = newValue;
    self.displayData = [].concat(self.fileData);
  });

  $scope.$watch(function(){
      return FileService.getCurrentDirectory();
    }, function (newValue) {
    self.currentDirectory = newValue;
  });

  $scope.$watch(function(){
      return FileService.getRootDirectory();
    }, function (newValue) {
    self.rootDirectory = newValue;
  });

  $scope.$watch(function(){
      return FileService.getVolumeInfo();
    }, function (newValue) {
      if(typeof newValue != 'undefined') {
        self.volumeInfo = newValue.percent;
        self.volumeUsed = newValue.used;
        self.volumeSize = newValue.size;
      }
  });
  self.isCopied = false;
  self.copyFile = function() {
    self.copiedFile = self.selectedFile;
    self.isCopied = true;
  };

  self.pasteFile = function() {
    // Form path
    var path = "";
    var dirpath = "";
    var i = 0;
    for(var pathComponent in self.currentDirectory) {
      if(self.currentDirectory[pathComponent] != '/')
        path = path + "/" + self.currentDirectory[pathComponent];
      i++;
    }
    path += "/";
    dirpath = path;

    if(self.copiedFile.type == "dir") {
      path += self.copiedFile.filename;
    }

    FilesystemService.pasteFile(self.copiedFile.filepath, path, function(data){
      console.log(data);
      FilesystemService.getFiles({'filepath': dirpath}, function(data){
        self.fileData = data;
        self.isCopied = false;
        self.copiedFile = "";
      });
    });
  };

  self.duplicateFile = function(){
    FilesystemService.getNextDuplicate(self.selectedFile.filepath, function(data){
      FilesystemService.duplicateFile(data.originalFile, data.result, function(data){
        // Refresh Filetree
        self.refreshDirectory();
      });
    });
  };

  self.showVolumeInfo = function() {
    if(typeof self.volumeUsed == 'undefined') {
      return false;
    }
    return true;
  }

  self.getters = {
    filename: function (value) {
        //this will sort by the length of the first name string
        return value.filename;
    },
    size: function(value) {
      return parseFloat(value.size.split()[0]);
    }
  };

  // Get groups
  FilesystemService.getGroups(function(data, status, headers, config){
    self.groups = data;
  });

  self.refreshDirectory = function() {
    // Form path
    var path = "";
    var dirpath = "";
    var i = 0;
    for(var pathComponent in self.currentDirectory) {
      if(self.currentDirectory[pathComponent] != '/')
        path = path + "/" + self.currentDirectory[pathComponent];
      i++;
    }
    path += "/";
    dirpath = path;
    FilesystemService.getFiles({'filepath': dirpath}, function(data){
      self.fileData = data;
    });
  }

  self.changeDir = function(index) {
    // Form path
    var path = ""
    var i = 0;
    for(var pathComponent in self.currentDirectory) {
      if(self.currentDirectory[pathComponent] != '/')
        path = path + "/" + self.currentDirectory[pathComponent];
      if(i == index) {
        break;
      }
      i++;
    }
    path += "/";
    if(!self.isNavigatable(index)) {
      return;
    }
    FilesystemService.getFiles({'filepath': path}, function(data, status, headers, config){
      self.fileData = data;
      FileService.setCurrentDirectory(path);
    });
  };

  self.populatePermissions = function() {
    // Perm sting looks like 644, 755 etc
    // Split it into its consituents
    var perm_array = self.selectedFile.perm_string.split('')
    // Permissions object for current file
    self.currentFilePermissions = {
      'user': {
        'r': false,
        'w': false,
        'x': false
      },
      'group': {
        'r': false,
        'w': false,
        'x': false
      },
      'others': {
        'r': false,
        'w': false,
        'x': false
      }
    };

    // TODO: Iterate over object and do in one loop instead of 3

    // User Permissions
    if(perm_array[0] == "7") {
      self.currentFilePermissions['user']['r'] = true;
      self.currentFilePermissions['user']['w'] = true;
      self.currentFilePermissions['user']['x'] = true;
    } else if(perm_array[0] == "6") {
      self.currentFilePermissions['user']['r'] = true;
      self.currentFilePermissions['user']['w'] = true;
    } else if(perm_array[0] == "5") {
      self.currentFilePermissions['user']['r'] = true;
      self.currentFilePermissions['user']['x'] = true;
    } else if(perm_array[0] == "4") {
      self.currentFilePermissions['user']['r'] = true;
    } else if(perm_array[0] == "3") {
      self.currentFilePermissions['user']['w'] = true;
      self.currentFilePermissions['user']['x'] = true;
    } else if(perm_array[0] == "2") {
      self.currentFilePermissions['user']['w'] = true;
    } else if(perm_array[0] == "1") {
      self.currentFilePermissions['user']['x'] = true;
    }

    // Group Permissions
    if(perm_array[1] == "7") {
      self.currentFilePermissions['group']['r'] = true;
      self.currentFilePermissions['group']['w'] = true;
      self.currentFilePermissions['group']['x'] = true;
    } else if(perm_array[1] == "6") {
      self.currentFilePermissions['group']['r'] = true;
      self.currentFilePermissions['group']['w'] = true;
    } else if(perm_array[1] == "5") {
      self.currentFilePermissions['group']['r'] = true;
      self.currentFilePermissions['group']['x'] = true;
    } else if(perm_array[1] == "4") {
      self.currentFilePermissions['group']['r'] = true;
    } else if(perm_array[1] == "3") {
      self.currentFilePermissions['group']['w'] = true;
      self.currentFilePermissions['group']['x'] = true;
    } else if(perm_array[1] == "2") {
      self.currentFilePermissions['group']['w'] = true;
    } else if(perm_array[1] == "1") {
      self.currentFilePermissions['group']['x'] = true;
    }

    // Others Permissions
    if(perm_array[2] == "7") {
      self.currentFilePermissions['others']['r'] = true;
      self.currentFilePermissions['others']['w'] = true;
      self.currentFilePermissions['others']['x'] = true;
    } else if(perm_array[2] == "6") {
      self.currentFilePermissions['others']['r'] = true;
      self.currentFilePermissions['others']['w'] = true;
    } else if(perm_array[2] == "5") {
      self.currentFilePermissions['others']['r'] = true;
      self.currentFilePermissions['others']['x'] = true;
    } else if(perm_array[2] == "4") {
      self.currentFilePermissions['others']['r'] = true;
    } else if(perm_array[2] == "3") {
      self.currentFilePermissions['others']['w'] = true;
      self.currentFilePermissions['others']['x'] = true;
    } else if(perm_array[2] == "2") {
      self.currentFilePermissions['others']['w'] = true;
    } else if(perm_array[2] == "1") {
      self.currentFilePermissions['others']['x'] = true;
    }
  };

  self.show_details = false;
  self.ShowDetails = function(selectedFile){
    self.selectedFile = selectedFile;
    self.show_details = true;
    // Set the permissions for the file
    self.populatePermissions();
  };

  self.changeGroup = function(){
    var group_name = self.selectedFile.group
    var filepath = self.selectedFile.filepath
    FilesystemService.changeGroup(filepath, group_name, function(data, status, headers, config){
      console.log(data);
    });
  };

  self.isNavigatable = function(index) {
    return index >= self.rootDirectory.length - 1;
  };

  self.changePermissions = function() {
    // Form permissions object
    var perms = ["0"];
    var keys = ['user', 'group', 'others'];
    for(var index in keys) {
      var perm = 0;
      var key = keys[index]
      if(self.currentFilePermissions[key]['r']) {
        perm += 4;
      }
      if(self.currentFilePermissions[key]['w']) {
        perm += 2;
      }
      if(self.currentFilePermissions[key]['x']) {
        perm += 1;
      }
      perms.push("" + perm);
    }
    // console.log(perms);
    // Change Permissions with FilesystemService
    FilesystemService.changePermissions(self.selectedFile.filepath, perms.join(""), function(data, status, headers, config){
      //Refresh the File table
      console.log(data);
      var path = "/" + self.currentDirectory.slice(1).join("/");
      FilesystemService.getFiles({filepath: path}, function(data, status, headers, config){
        self.fileData = data;
      });
    });
  };
}])
.factory('FileService', ['$rootScope', function($rootScope){
  var fileData;
  var currentDirectory = [];
  var root_dir = [];
  var volume_info;
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
    // Last component will be blank and needs to be spliced
    currentDirectory.splice(-1)
  };

  var setRootDirectory = function(rootDirectory) {
    root_dir = rootDirectory.split("/")
    // Current Directory Path should be '/'
    root_dir[0] = "/";
    // Last component will be blank and needs to be spliced
    root_dir.splice(-1)
  };

  var setVolumeInfo = function(volumeInfo) {
    volume_info = volumeInfo;
  };

  var getRootDirectory = function() {
    return root_dir;
  };

  return {
    setFileData: setFileData,
    getFileData: getFileData,
    setCurrentDirectory: setCurrentDirectory,
    getCurrentDirectory: getCurrentDirectory,
    setRootDirectory: setRootDirectory,
    getRootDirectory: getRootDirectory,
    setVolumeInfo: setVolumeInfo,
    getVolumeInfo: getVolumeInfo
  };
}]);
