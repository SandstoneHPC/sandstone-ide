'use strict';

angular.module('oide.filebrowser')

.controller('FiletreeController', ['FiletreeService', '$http', function(FiletreeService, $http){
  var self = this;
  this.treeData = {};
  $http
    .get('/filebrowser/filetree/a/dir')
    .success(function(data, status, headers, config) {
      for (var i=0;i<data.length;i++) {
        data[i].children = [];
      }
      self.treeData.filetreeContents = data;
      self.treeOptions = {
        multiSelection: false,
        isLeaf: function(node) {
            return node.type !== 'dir';
          },
          injectClasses: {
            iExpanded: "filetree-icon fa fa-folder-open",
            iCollapsed: "filetree-icon fa fa-folder",
            iLeaf: "filetree-icon fa fa-file",
          }};
    }).
    error(function(data, status, headers, config) {
      // $log.error('Failed to initialize filetree.');
    });
}]);
