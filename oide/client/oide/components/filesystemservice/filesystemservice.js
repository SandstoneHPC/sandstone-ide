'use strict';

angular.module('oide.filesystemservice', [])

.service('FilesystemService', ['$http', '$log',function($http, $log){

  return {
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
    }
  }
}]);
