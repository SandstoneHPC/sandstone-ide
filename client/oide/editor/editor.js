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
.factory('FiletreeService', ['$http', '$log', function($http,$log) {
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
  var initializeFiletree = function () {
    $http
      .get('/filebrowser/filetree/a/dir')
      .success(function(data, status, headers, config) {
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
        } else {
          return getNodeFromPath(filepath, nodeList[i].children);
        }
      }
    }
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
  }
  var getDirContents = function (node) {
    $http
      .get('/filebrowser/filetree/a/dir', {
        params: {
          dirpath: node.filepath
        }
      }).
      success(function(data, status, headers, config) {
        for (var i=0;i<data.length;i++) {
          if (!data[i].hasOwnProperty('children')) {
            data[i].children = [];
          }

        }
        node.children = data;
        var matchedNode;
        for (var i=0;i<data.length;i++) {
          if (isExpanded(data[i].filepath)) {
            matchedNode = getNodeFromPath(data[i].filepath,treeData.filetreeContents);
            if (!(typeof matchedNode === 'undefined')) {
              getDirContents(matchedNode);
            }
          }
        }
      }).
      error(function(data, status, headers, config) {
        $log.error('Failed to grab dir contents from ',node.filepath);
      });
  };
  // var getDirContentsR = function (node) {
  //   var retObj = {};
  //   $http
  //     .get('/filebrowser/filetree/a/dir', {
  //       params: {
  //         dirpath: node.filepath
  //       }
  //     }).
  //     success(function(data, status, headers, config) {
  //       var i, matchedNode;
  //       for (i=0;i<data.length;i++) {
  //         if (!data[i].hasOwnProperty('children')) {
  //           data[i].children = [];
  //         } else {
  //           if (isExpanded(data[i].filepath)) {
  //             matchedNode = getNodeFromPath(data[i].filepath,treeData.filetreeContents);
  //             if (!(typeof matchedNode === 'undefined')) {
  //               data[i].children = getDirContentsR(matchedNode);
  //             }
  //           }
  //         }
  //       }
  //       retObj.data = data;
  //     }).
  //     error(function(data, status, headers, config) {
  //       $log.error('Failed to grab dir contents from ',node.filepath);
  //     });
  //     return retObj.data;
  // };
  var updateFiletree = function () {
    for (var i=0;i<treeData.filetreeContents.length;i++) {
      getDirContents(treeData.filetreeContents[i]);
    }
  };
  initializeFiletree();
  return {
    treeData: treeData,
    selectionDesc: selectionDesc,
    describeSelection: function (node, selected) {
      selectionDesc.multipleSelections = treeData.selectedNodes.length > 1;
      selectionDesc.noSelections = treeData.selectedNodes.length === 0;
      var dirSelected = false;
      for (var i in treeData.selectedNodes) {
        if (treeData.selectedNodes[i].type==='dir') {
          dirSelected = true;
        }
      }
      selectionDesc.dirSelected = dirSelected;
    },
    getDirContents: function (node) {
      getDirContents(node);
      // updateFiletree();
    },
    updateFiletree: function () {
      updateFiletree();
    }
  };
}])
.controller('FiletreeControlCtrl', ['$scope', 'FiletreeService', function($scope,FiletreeService) {
  $scope.sd = FiletreeService.selectionDesc;
  $scope.updateFiletree = function () {
    FiletreeService.updateFiletree();
  };
}])
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
