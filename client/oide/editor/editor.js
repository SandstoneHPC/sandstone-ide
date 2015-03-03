'use strict';

angular.module('oide.editor', ['ngRoute','ui.bootstrap','ui.ace','treeControl'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editor', {
    templateUrl: '/static/editor/editor.html'
  });
}])
.controller('EditorCtrl', ['$scope', 'EditorService', function($scope, EditorService) {
  $scope.onAceLoad = function(_ace) {
    EditorService.onAceLoad(_ace);
  };
}])
.controller('EditorTabsCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  $scope.tabs = [
    {filename:'coolModule.py', filepath:'/lustre/ProjectDir/modules/coolModule.py', content:'', active:true, unsaved:true},
    {filename:'outfile.txt', filepath:'/projects/outfile.txt', content:''}
  ];
  $scope.loadEditorContents = function (tab) {
    EditorService.loadSession(tab.filepath);
  };
  $scope.undoChanges = function (tab) {
    EditorService.undoChanges(tab.filepath);
  };
  $scope.redoChanges = function (tab) {
    EditorService.redoChanges(tab.filepath);
  };
  $scope.copySelection = function () {
    EditorService.copySelection();
  };
  $scope.cutSelection = function () {
    EditorService.cutSelection();
  };
  $scope.pasteClipboard = function () {
    EditorService.pasteClipboard();
  };
  $scope.commentSelection = function () {
    EditorService.commentSelection();
  };
}])
.controller('EditorFindCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  $scope.findOptions = EditorService.findOptions;
  $scope.findString = function () {
    EditorService.findString($scope.findNeedle);
  };
  $scope.findPreviousString = function () {
    EditorService.findPreviousString($scope.findNeedle);
  };
  $scope.replaceCurrentString = function () {
    EditorService.replaceCurrentString($scope.replaceNeedle);
  };
  $scope.replaceAllStrings = function () {
    EditorService.replaceAllStrings($scope.replaceNeedle);
  };
}])
.controller('EditorSettingsCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  // $scope.editorSettings.fontSize = { label:12, value:12 };
  // $scope.editorSettings.tabSize = { label:4, value:4 };
  var fontSizes = [];
  var tabSizes = [];
  for (var i=1;i<9;i++) { tabSizes.push({ label:i, value:i }) }
  for (var i=8;i<21;i+=2) { fontSizes.push({ label:i, value:i }) }
  $scope.fontOptions = fontSizes;
  $scope.tabOptions = tabSizes;

  $scope.editorSettings = EditorService.editorSettings;
  $scope.applyEditorSettings = function () {
    EditorService.applyEditorSettings();
  };
}])
.factory('EditorService', ['$window', '$log', function ($window, $log) {
  var editor = {};
  var currentSession = ''
  var editorSessions = {};
  var clipboard = '';
  var editorSettings = {
    showInvisibles: true,
    useSoftTabs: true,
    fontSize: {label:12, value:12},
    tabSize: {label:4, value:4},
    showIndentGuides: true
  };
  var findOptions = {
    backwards: false,
    wrap: true,
    caseSensitive: false,
    wholeWord: false,
    regExp: false
  };
  var applySettings = function () {
    editor.setShowInvisibles(editorSettings.showInvisibles);
    editor.getSession().setUseSoftTabs(editorSettings.useSoftTabs);
    editor.setFontSize(editorSettings.fontSize.value);
    editor.getSession().setTabSize(editorSettings.tabSize.value);
    editor.setDisplayIndentGuides(editorSettings.showIndentGuides);
  };
  return {
    findOptions: findOptions,
    editorSettings: editorSettings,
    onAceLoad: function (_ace) {
      editor = _ace;
      applySettings();
      $log.debug('Loaded Ace instance: ', editor);
    },
    loadSession: function (filepath) {
      if (!(filepath in editorSessions)) {
        $log.debug('Creating new EditSession: ', filepath)
        editorSessions[filepath] = $window.ace.createEditSession('','text');
      }
      editorSessions[currentSession] = editor.getSession();
      editor.setSession(editorSessions[filepath]);
      $log.debug('Switching sessions from ', currentSession, ' to ', filepath)
      currentSession = filepath;
    },
    applyEditorSettings: function () {
      applySettings();
    },
    findString: function (needle) {
      editor.find(needle, findOptions);
    },
    findPreviousString: function (needle) {
      editor.findPrevious(needle, findOptions);
    },
    replaceCurrentString: function (replaceNeedle) {
      editor.replace(replaceNeedle);
    },
    replaceAllStrings: function (replaceNeedle) {
      editor.replaceAll(replaceNeedle);
    },
    undoChanges: function (filepath) {
      editorSessions[filepath].getUndoManager().undo();
    },
    redoChanges: function (filepath) {
      editorSessions[filepath].getUndoManager().redo();
    },
    copySelection: function () {
      clipboard = editor.getCopyText();
    },
    cutSelection: function () {
      clipboard = editor.getCopyText();
      editor.insert('');
    },
    pasteClipboard: function () {
      editor.insert(clipboard);
    },
    commentSelection: function () {
      editor.toggleCommentLines();
    }
  };
}])
.factory('FiletreeService', ['$http', '$document', '$q', '$log', function($http,$document,$q,$log) {
  var treeData = {
    filetreeContents: [
      // { "type": "dir", "filepath": "/tmp/", "filename" : "tmp", "children" : []}
    ]
  };
  var selectionDesc = {
    noSelections: true,
    multipleSelections: false,
    dirSelected: false
  };
  var clipboard = [];
  var initializeFiletree = function () {
    $http
      .get('/filebrowser/filetree/a/dir')
      .success(function(data, status, headers, config) {
        for (var i=0;i<data.length;i++) {
          data[i].children = [];
        }
        treeData.filetreeContents = data;
      }).
      error(function(data, status, headers, config) {
        $log.error('Failed to initialize filetree.');
      });
  };
  var getNodeFromPath = function (filepath, nodeList) {
    var matchedNode;
    for (var i=0;i<nodeList.length;i++) {
      if (filepath.lastIndexOf(nodeList[i].filepath,0) === 0) {
        if (filepath === nodeList[i].filepath) {
          return nodeList[i];
        } else if (nodeList[i].type === 'dir') {
          return getNodeFromPath(filepath, nodeList[i].children);
        }
      }
    }
  };
  var getFilepathsForDir = function (dirpath) {
    var children = getNodeFromPath(dirpath,treeData.filetreeContents).children;
    var filepaths = [];
    for (var i=0;i<children.length;i++) {
      filepaths.push(children[i].filepath);
    }
    return filepaths;
  };
  var removeNodeFromFiletree = function (node){
    var index;
    index = treeData.selectedNodes.indexOf(node);
    if (index >= 0) {
      treeData.selectedNodes.splice(index, 1);
    }
    index = treeData.expandedNodes.indexOf(node);
    if (index >= 0) {
      treeData.expandedNodes.splice(index, 1);
    }
    var filepath, dirpath, parentNode;
    if (node.filepath.slice(-1) === '/') {
      filepath = node.filepath.substring(0,node.filepath.length-1);
    } else {
      filepath = node.filepath;
    }
    dirpath = filepath.substring(0,filepath.lastIndexOf('/')+1);
    parentNode = getNodeFromPath(dirpath,treeData.filetreeContents);
    index = parentNode.children.indexOf(node);
    parentNode.children.splice(index,1);
    describeSelection();
  };
  var isExpanded = function (filepath) {
    for (var i=0;i<treeData.expandedNodes.length;i++) {
      if (treeData.expandedNodes[i].filepath === filepath) {
        return true;
      }
    }
    return false;
  };
  var isDisplayed = function (filepath) {
    for (var i=0;i<treeData.filetreeContents.length;i++) {
      if (treeData.filetreeContents[i].filepath === filepath) {
        return true;
      }
    }
    return false;
  };
  var getDirContents = function (node) {
    $http
      .get('/filebrowser/filetree/a/dir', {
        params: {
          dirpath: node.filepath
        }
      }).
      success(function(data, status, headers, config) {
        var matchedNode;
        var currContents = getFilepathsForDir(node.filepath);
        for (var i=0;i<data.length;i++) {
          if (currContents.indexOf(data[i].filepath) >= 0) {
            matchedNode = getNodeFromPath(data[i].filepath,treeData.filetreeContents);
            if ((data[i].type === 'dir')&&isExpanded(data[i].filepath)) {
              getDirContents(matchedNode);
            }
            currContents.splice(currContents.indexOf(data[i].filepath), 1);
          } else {
            data[i].children = [];
            node.children.push(data[i]);
          }
        }
        var index;
        for (var i=0;i<currContents.length;i++) {
          matchedNode = getNodeFromPath(currContents[i],treeData.filetreeContents);
          removeNodeFromFiletree(matchedNode);
        }
      }).
      error(function(data, status, headers, config) {
        $log.error('Failed to grab dir contents from ',node.filepath);
      });
  };
  var updateFiletree = function () {
    var filepath, node;
    for (var i=0;i<treeData.expandedNodes.length;i++) {
      getDirContents(treeData.expandedNodes[i]);
    }
  };
  var describeSelection = function () {
    selectionDesc.multipleSelections = treeData.selectedNodes.length > 1;
    selectionDesc.noSelections = treeData.selectedNodes.length === 0;
    var dirSelected = false;
    for (var i in treeData.selectedNodes) {
      if (treeData.selectedNodes[i].type==='dir') {
        dirSelected = true;
      }
    }
    selectionDesc.dirSelected = dirSelected;
  };
  initializeFiletree();
  return {
    treeData: treeData,
    selectionDesc: selectionDesc,
    clipboardEmpty: function () {
      return clipboard.length === 0;
    },
    describeSelection: function (node, selected) {
      describeSelection();
    },
    getDirContents: function (node) {
      getDirContents(node);
      // updateFiletree();
    },
    updateFiletree: function () {
      updateFiletree();
    },
    createNewFile: function () {
      var selectedDir = treeData.selectedNodes[0].filepath;
      var newFilePath;
      $http
        .get(
          '/filebrowser/a/fileutil', {
            params: {
              dirpath: selectedDir,
              operation: 'GET_NEXT_UNTITLED_FILE'
            }
        })
        .success(function (data, status, headers, config) {
          $log.debug('GET: ', data);
          newFilePath = data.result;
        })
        .then(function (data, status, headers, config) {
          $http({
            url: '/filebrowser/localfiles'+newFilePath,
            method: 'POST',
            // headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
            params: {_xsrf:getCookie('_xsrf')}
            })
            .success(function (data, status, headers, config) {
              $log.debug('POST: ', data);
            })
            .then(function (data, status, headers, config) {
              updateFiletree();
            });
        });
    },
    createNewDir: function () {
      var selectedDir = treeData.selectedNodes[0].filepath;
      var newDirPath;
      $http
        .get(
          '/filebrowser/a/fileutil', {
            params: {
              dirpath: selectedDir,
              operation: 'GET_NEXT_UNTITLED_DIR'
            }
        })
        .success(function (data, status, headers, config) {
          $log.debug('GET: ', data);
          newDirPath = data.result;
        })
        .then(function (data, status, headers, config) {
          $http({
            url: '/filebrowser/localfiles'+newDirPath,
            method: 'POST',
            // headers : {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
            params: {
              _xsrf:getCookie('_xsrf'),
              isDir: true
            }
            })
            .success(function (data, status, headers, config) {
              $log.debug('POST: ', data);
            })
            .then(function (data, status, headers, config) {
              updateFiletree();
            });
        });
    },
    createDuplicate: function () {
      var selectedFile = treeData.selectedNodes[0].filepath;
      var newFilePath;
      $http
        .get(
          '/filebrowser/a/fileutil', {
            params: {
              filepath: selectedFile,
              operation: 'GET_NEXT_DUPLICATE'
            }
        })
        .success(function (data, status, headers, config) {
          $log.debug('GET: ', data);
          newFilePath = data.result;
        })
        .then(function (data, status, headers, config) {
          var isDir = newFilePath.substring(-1) === '/';
          $http({
            url: '/filebrowser/localfiles'+newFilePath,
            method: 'POST',
            params: {
              _xsrf:getCookie('_xsrf'),
              isDir: isDir
            }
            })
            .success(function (data, status, headers, config) {
              $log.debug('POST: ', data);
            })
            .then(function (data, status, headers, config) {
              updateFiletree();
            });
        });
    },
    deleteFiles: function () {
      for (var i=0;i<treeData.selectedNodes.length;i++) {
        var filepath = treeData.selectedNodes[i].filepath;
        $http({
          url: '/filebrowser/localfiles'+filepath,
          method: 'DELETE',
          params: {
            _xsrf:getCookie('_xsrf')
            }
          })
          .success(function (data, status, headers, config) {
            $log.debug('DELETE: ', data.result);
            var node = getNodeFromPath(data.filepath,treeData.filetreeContents);
            removeNodeFromFiletree(node);
          })
          .then(function (data, status, headers, config) {
            updateFiletree();
          });
      }
    },
    copyFiles: function () {
      clipboard = [];
      var node, i;
      for (i=0;i<treeData.selectedNodes.length;i++) {
        node = treeData.selectedNodes[i]
        clipboard.push({
          'filename': node.filename,
          'filepath': node.filepath
        });
      }
      $log.debug('Copied ', i, ' files to clipboard: ', clipboard)
    },
    pasteFiles: function () {
      var i;
      var newDirPath = treeData.selectedNodes[0].filepath;
      for (i=0;i<clipboard.length;i++) {
        $http({
          url: '/filebrowser/a/fileutil',
          method: 'POST',
          params: {
            _xsrf:getCookie('_xsrf'),
            operation: 'COPY',
            origpath: clipboard[i].filepath,
            newpath: newDirPath+clipboard[i].filename
          }
          })
          .success(function (data, status, headers, config) {
            $log.debug('POST: ', data.result);
          });
      }
      clipboard = [];
      if (!isExpanded(newDirPath)) {
        var node = getNodeFromPath(newDirPath,treeData.filetreeContents);
        treeData.expandedNodes.push(node);
      }
      updateFiletree();
    }
  };
}])
.controller('FiletreeControlCtrl', ['$scope', '$modal', '$log', 'FiletreeService', function($scope,$modal,$log,FiletreeService) {
  $scope.sd = FiletreeService.selectionDesc;
  $scope.fcDropdown = false;
  $scope.clipboardEmpty = FiletreeService.clipboardEmpty();
  $scope.updateFiletree = function () {
    FiletreeService.updateFiletree();
  };
  $scope.createNewFile = function () {
    FiletreeService.createNewFile();
  };
  $scope.createNewDir = function () {
    FiletreeService.createNewDir();
  };
  $scope.createDuplicate = function () {
    FiletreeService.createDuplicate();
  };
  $scope.deleteFiles = function () {
    var deleteModalInstance = $modal.open({
      templateUrl: '/static/editor/delete-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'DeleteModalCtrl',
      resolve: {
        files: function () {
          return FiletreeService.treeData.selectedNodes;
        }
      }
    });

    deleteModalInstance.result.then(function () {
      $log.debug('Files deleted at: ' + new Date());
      FiletreeService.deleteFiles();
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };
  $scope.copyFiles = function () {
    FiletreeService.copyFiles();
  };
  $scope.pasteFiles = function () {
    FiletreeService.pasteFiles();
  };
}])
.controller('DeleteModalCtrl', function ($scope, $modalInstance, files) {

  $scope.files = files;

  $scope.remove = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('FiletreeCtrl', ['$scope', '$log', 'FiletreeService', function($scope,$log,FiletreeService) {
  $scope.treeData= FiletreeService.treeData;
  $scope.treeOptions = {
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
  $scope.describeSelection = function (node, selected) {
    FiletreeService.describeSelection(node, selected);
  };
  $scope.getDirContents = function (node, expanded) {
    FiletreeService.getDirContents(node);
  };
  $scope.showSelected = function(node, selected) {
    console.log(node);
    console.log(selected);
      // $scope.selectedNodes = selected;
  };
}]);
