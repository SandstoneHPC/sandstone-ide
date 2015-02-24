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
.controller('TreeCtrl', ['$scope', function($scope) {
    function createSubTree(level, width, prefix) {
          if (level > 0) {
              var res = [];
              for (var i=1; i <= width; i++)
                  res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "i": i, "children": createSubTree(level-1, width, prefix + i +".") });
              return res;
          }
          else
              return [];
      }
    $scope.treeData=[
          { "type": "dir", "filename" : "/lustre/", "children" : [
              { "type": "file", "filename" : "aTestFile.py", "children" : [] },
              { "type": "file", "filename" : "testFile.py", "children" : [] },
              { "type": "dir", "filename" : "ProjectDir", "children" : [
                  { "type": "dir", "filename" : "modules", "children" : [
                      { "type": "file", "filename" : "__init__.py", "children" : [] },
                      { "type": "file", "filename" : "coolModule.py", "children" : [] }
                  ]}
              ]}
          ]},
          { "type": "dir", "filename" : "/projects/", "children" : [
            { "type": "file", "filename" : "outfile.txt", "children" : [] }
          ]}
      ];
    $scope.treeOptions = {
      multiSelection: true,
      injectClasses: {
        iExpanded: "filetree-icon fa fa-folder-open",
        iCollapsed: "filetree-icon fa fa-folder",
        iLeaf: "filetree-icon fa fa-file",
      }
    };
    $scope.noSelections = true;
    $scope.multipleSelections = false;
    $scope.dirSelected = false;
    $scope.selectedNodes = [];
    $scope.disableFilecontrols = function(node, selected) {
      $scope.multipleSelections = $scope.selectedNodes.length > 1;
      $scope.noSelections = $scope.selectedNodes.length === 0;
      var dirSelected = false;
      for (var i in $scope.selectedNodes) {
        if ($scope.selectedNodes[i].type==='dir') {
          dirSelected = true;
        }
      }
      $scope.dirSelected = dirSelected;
    };
    $scope.showSelected = function(node, selected) {
      console.log(node);
      console.log(selected);
        // $scope.selectedNodes = selected;
    };
}]);
