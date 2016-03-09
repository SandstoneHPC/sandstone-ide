angular.module('oide.filetreedirective', [])

.directive('oideFiletree', [function(){
  return {
    restrict: 'A',
    scope: {
      treeData: '='
    },
    templateUrl: '/static/core/components/filetreedirective/templates/filetree.html',
    controller: ['$scope', '$document', '$element', '$timeout', 'FilesystemService', '$rootScope', function($scope, $document, $element, $timeout, FilesystemService, $rootScope) {
      var self = $scope;

      self.treeData = {
        filetreeContents: [
          // { "type": "dir", "filepath": "/tmp/", "filename" : "tmp", "children" : []}
        ]
      };
      self.selectionDesc = {
        noSelections: true,
        multipleSelections: false,
        dirSelected: false
      };
      self.clipboard = [];

      self.populateTreeData = function(data, status, headers, config) {
        for (var i=0;i<data.length;i++) {
          data[i].children = [];
        }
        self.treeData.filetreeContents = data;
      };

      self.initializeFiletree = function () {
        FilesystemService.getFiles('', self.populateTreeData);
      };
      self.initializeFiletree();
      self.getNodeFromPath = function (filepath, nodeList) {
        var matchedNode;
        var folderName;
        var strippedFilepath;
        for (var i=0;i<nodeList.length;i++) {
          folderName = nodeList[i].filepath;
          strippedFilepath = filepath;
          if(filepath.charAt(filepath.length - 1) == '/') {
            strippedFilepath = filepath.substr(0, filepath.length - 1);
          }
          if(nodeList[i].type == 'dir' && folderName.charAt(folderName.length - 1) == '/') {
            folderName = folderName.substr(0, folderName.length - 1);
          }
          if (strippedFilepath.lastIndexOf(folderName,0) === 0) {
            if (strippedFilepath === folderName) {
              return nodeList[i];
            } else if (nodeList[i].type === 'dir') {
              return self.getNodeFromPath(filepath, nodeList[i].children);
            }
          }
        }
      };
      self.getFilepathsForDir = function (dirpath) {
        var children = self.getNodeFromPath(dirpath,self.treeData.filetreeContents).children;
        var filepaths = [];
        for (var i=0;i<children.length;i++) {
          filepaths.push(children[i].filepath);
        }
        return filepaths;
      };
      self.removeNodeFromFiletree = function (node){
        var index;
        index = self.treeData.selectedNodes.indexOf(node);
        if (index >= 0) {
          self.treeData.selectedNodes.splice(index, 1);
        }
        index = self.treeData.expandedNodes.indexOf(node);
        if (index >= 0) {
          self.treeData.expandedNodes.splice(index, 1);
        }
        var filepath, dirpath, parentNode;
        if (node.filepath.slice(-1) === '/') {
          filepath = node.filepath.substring(0,node.filepath.length-1);
        } else {
          filepath = node.filepath;
        }
        dirpath = filepath.substring(0,filepath.lastIndexOf('/')+1);
        parentNode = self.getNodeFromPath(dirpath,treeData.filetreeContents);
        index = parentNode.children.indexOf(node);
        parentNode.children.splice(index,1);
        self.describeSelection();
      };
      self.isExpanded = function (filepath) {
        for (var i=0;i<self.treeData.expandedNodes.length;i++) {
          if (self.treeData.expandedNodes[i].filepath === filepath) {
            return true;
          }
        }
        return false;
      };
      self.isDisplayed = function (filepath) {
        for (var i=0;i<self.treeData.filetreeContents.length;i++) {
          if (self.treeData.filetreeContents[i].filepath === filepath) {
            return true;
          }
        }
        return false;
      };

      self.populatetreeContents = function(data, status, headers, config, node) {
          var matchedNode;
          var currContents = self.getFilepathsForDir(node.filepath);
          for (var i=0;i<data.length;i++) {
            if (currContents.indexOf(data[i].filepath) >= 0) {
              matchedNode = self.getNodeFromPath(data[i].filepath,treeData.filetreeContents);
              if ((data[i].type === 'dir') && self.isExpanded(data[i].filepath)) {
                self.getDirContents(matchedNode);
              }
              currContents.splice(currContents.indexOf(data[i].filepath), 1);
            } else {
              data[i].children = [];
              node.children.push(data[i]);
            }
          }
          var index;
          for (var i=0;i<currContents.length;i++) {
            matchedNode = self.getNodeFromPath(currContents[i],self.treeData.filetreeContents);
            self.removeNodeFromFiletree(matchedNode);
          }
        };

      self.updateFiletree = function () {
        var filepath, node;
        for (var i=0;i<self.treeData.expandedNodes.length;i++) {
          self.getDirContents(treeData.expandedNodes[i]);
        }
      };

      // Callback of invocation to FilesystemService to create a file
      // Update the filetree to show the new file
      self.createFileCallback = function(data, status, headers, config){
        $log.debug('POST: ', data);
        self.updateFiletree();
      };

      // Callback of invocation to FilesystemService to get the next Untitled FIle
      // Invoke the FilesystemService to create the new file
      self.gotNewUntitledFile = function(data, status, headers, config) {
        $log.debug('GET: ', data);
        var newFilePath = data.result;
        // Post back new file to backend
        FilesystemService.createNewFile(newFilePath, self.createFileCallback);
      };
      // Callback for invocation to FilesystemService renameFile method
      self.fileRenamed = function(data, status, headers, config, node) {
        $rootScope.$emit('fileRenamed', node.filepath, data.result);
        self.removeNodeFromFiletree(node);
        self.updateFiletree();
        $log.debug('POST: ', data.result);
      };

      // Callback for invocation to FilesystemService pasteFile method
      self.pastedFiles = function(data, status, headers, config, node){
        $log.debug('POST: ', data.result);
      };

      // Callback for invocation to FilesystemService deleteFile method
      self.deletedFile = function(data, status, headers, config, node) {
        $log.debug('DELETE: ', data.result);
        var node = self.getNodeFromPath(data.filepath,self.treeData.filetreeContents);
        self.removeNodeFromFiletree(node);
        $rootScope.$emit('fileDeleted', data.filepath);
        self.updateFiletree();
      };

      // Callback for getting the next duplicated file for selected file
      self.gotNextDuplicateFile = function(data, status, headers, config) {
        $log.debug('GET: ', data);
         var newFilePath = data.result;
         FilesystemService.duplicateFile(data.originalFile, newFilePath, self.duplicatedFile);
      };

      // Callback for duplicating a file
      self.duplicatedFile = function(data, status, headers, config) {
        $log.debug('Copied: ', data.result);
        self.updateFiletree();
      };

      // Callback for getting a new untitled directory name from FilesystemService
      self.gotNewUntitledDir = function(data, status, headers, config) {
        $log.debug('GET: ', data);
        var newDirPath = data.result;
        FilesystemService.createNewDir(newDirPath, self.createdNewDir);
      };

      // Callback for creating new directory
      self.createdNewDir = function(data, status, headers, config) {
        $log.debug('POST: ', data);
        self.updateFiletree();
      };


      self.multiSelection = false;
      $document.on('keydown', (function (e) {
        if (e.keyCode === 17) {
          self.multiSelection = true;
        }
      }));
      $document.on('keyup', (function (e) {
        if (e.keyCode === 17) {
          self.multiSelection = false;
        }
      }));
      self.treeOptions = {
        multiSelection: true,
        isLeaf: function(node) {
          return node.type !== 'dir';
        },
        injectClasses: {
          iExpanded: "filetree-icon fa fa-folder-open",
          iCollapsed: "filetree-icon fa fa-folder",
          iLeaf: "filetree-icon fa fa-file",
        }
      };
      self.describeSelection = function (node, selected) {
        if (self.multiSelection === false) {
          if (selected) {
            self.treeData.selectedNodes = [node];
          } else {
            self.treeData.selectedNodes = [];
          }
        }
        self.selectionDesc.multipleSelections = self.treeData.selectedNodes.length > 1;
        self.selectionDesc.noSelections = self.treeData.selectedNodes.length === 0;
        var dirSelected = false;
        for (var i in self.treeData.selectedNodes) {
          if (self.treeData.selectedNodes[i].type==='dir') {
            dirSelected = true;
          }
        }
        self.selectionDesc.dirSelected = dirSelected;
      };
      self.getDirContents = function (node, expanded) {
        if(expanded) {
          FilesystemService.getFiles(node, self.populatetreeContents);
        }
      };
      self.showSelected = function(node, selected) {
        console.log(node);
        console.log(selected);
      };
    }
  ]};
}]);
