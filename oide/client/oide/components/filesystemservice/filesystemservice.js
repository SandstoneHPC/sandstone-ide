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
    },
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
    }
  }
}]);
