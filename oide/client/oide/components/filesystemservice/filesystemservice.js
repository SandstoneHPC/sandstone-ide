'use strict';

angular.module('oide.filesystemservice', [])

.service('FilesystemService', ['$http', '$log',function($http, $log){

  return {
    // Get all files for a particular node
    getFiles: function(node, callback) {
      $http
        .get('/filebrowser/filetree/a/dir', {
          params: {
            dirpath: node.filepath
          }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config, node);
        })
        .error(function(data, status, headers, config){
          $log.error('Failed to get files');
        });
    },
    // Get all the folders for a particular node
    getFolders: function(node, callback) {
      $http
        .get('/filebrowser/filetree/a/dir', {
          params: {
            dirpath: node.filepath,
            folders: 'true'
          }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config, node);
        })
        .error(function(data, status, headers, config){
          $log.error('Failed to get folders');
        });
    },
    // Returns the name of the next untitled file on filesystem
    getNextUntitledFile: function(selectedDir, callback) {
      $http
        .get(
          '/filebrowser/a/fileutil', {
            params: {
              dirpath: selectedDir,
              operation: 'GET_NEXT_UNTITLED_FILE'
            }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config);
        });
    },
    // Creates a new file on the filesystem
    createNewFile: function(newFilePath, callback){
      $http({
        url: '/filebrowser/localfiles'+newFilePath,
        method: 'POST',
        // headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
        params: {_xsrf:getCookie('_xsrf')}
        })
        .success(function (data, status, headers, config) {
          callback(data, status, headers, config);
        })
    },
    // Rename a file on the filesystem
    renameFile: function(newFilename, node, callback) {
      $http({
        url: '/filebrowser/a/fileutil',
        method: 'POST',
        params: {
          _xsrf:getCookie('_xsrf'),
          operation: 'RENAME',
          filepath: node.filepath,
          newFileName: newFilename
        }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config, node);
        });
    },
    // Paste file
    pasteFile: function(originalPath, newPath, callback) {
      $http({
        url: '/filebrowser/a/fileutil',
        method: 'POST',
        params: {
          _xsrf:getCookie('_xsrf'),
          operation: 'COPY',
          origpath: originalPath,
          newpath: newPath
        }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config);
        });
    },
    // Deleting files from the filesystem
    deleteFile: function(filepath, callback) {
      $http({
        url: '/filebrowser/localfiles'+filepath,
        method: 'DELETE',
        params: {
          _xsrf:getCookie('_xsrf')
          }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config);
        });
    },
    // Get the next duplicate from the filesystem
    getNextDuplicate: function(selectedFile, callback) {
      $http
        .get(
          '/filebrowser/a/fileutil', {
            params: {
              filepath: selectedFile,
              operation: 'GET_NEXT_DUPLICATE'
            }
        })
        .success(function(data, status, headers, config){
          data.originalFile = selectedFile;
          callback(data, status, headers, config);
        });
    },
    // Duplicate File
    duplicateFile: function(selectedFile, newFilePath, callback) {
      $http({
        url: '/filebrowser/a/fileutil',
        method: 'POST',
        params: {
          _xsrf:getCookie('_xsrf'),
          operation: 'COPY',
          origpath: selectedFile,
          newpath: newFilePath
        }
        })
        .success(function(data, status, headers, config){
          callback(data, status, headers, config);
        });
    }
  }
}]);
