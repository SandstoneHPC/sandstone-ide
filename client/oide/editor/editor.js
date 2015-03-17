'use strict';

angular.module('oide.editor', ['ngRoute','ui.bootstrap','ui.ace','treeControl'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/editor', {
    templateUrl: '/static/editor/editor.html'
  });
}])
.run(
  function (StateService,$log) {
    StateService.statePromise.then(function () {
      var state = StateService.getState();
      if (!('editor' in state)) {
        state.editor = {};
      }
    });
  }
)
.controller('EditorCtrl', ['$scope', 'EditorService', '$location', 'StateService', function($scope, EditorService, $location, StateService) {
  $scope.$on('$locationChangeStart', function (event) {
    StateService.storeState();
  });
  $scope.onAceLoad = function(_ace) {
    EditorService.onAceLoad(_ace);
  };
  $scope.noOpenSessions =  EditorService.noOpenSessions;
}])
.controller('EditorTabsCtrl', ['$scope', '$modal', '$log', 'EditorService', 'FiletreeService', function ($scope, $modal, $log, EditorService, FiletreeService) {
  $scope.openDocs = EditorService.openDocuments;
  $scope.loadEditorContents = function (tab) {
    EditorService.loadSession(tab.filepath);
  };
  $scope.createDocument = function () {
    EditorService.createDocument();
  };
  $scope.closeDocument = function ($event, tab) {
    $event.preventDefault();
    if (tab.unsaved) {
      var unsavedModalInstance = $modal.open({
        templateUrl: '/static/editor/close-unsaved-modal.html',
        backdrop: 'static',
        keyboard: false,
        controller: 'UnsavedModalCtrl',
        resolve: {
          file: function () {
            return tab;
          }
        }
      });

      unsavedModalInstance.result.then(function (file) {
        if (file.saveFile) {
          EditorService.saveDocument(file);
          $log.debug('Saved files at: ' + new Date());
          EditorService.closeDocument(file);
        } else {
          $log.debug('Closed without saving at: ' + new Date());
          EditorService.closeDocument(file);
        }
      }, function () {
        $log.debug('Modal dismissed at: ' + new Date());
      });
    } else {
      EditorService.closeDocument(tab);
    }
  };
  $scope.saveDocumentAs = function (tab) {
    var saveAsModalInstance = $modal.open({
      templateUrl: '/static/editor/saveas-modal.html',
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      controller: 'SaveAsModalCtrl',
      resolve: {
        file: function () {
          return tab;
        }
      }
    });

    saveAsModalInstance.result.then(function (newFile) {
      EditorService.fileRenamed(newFile.oldFilepath,newFile.filepath);
      var tab;
      for (var i=0;i<EditorService.openDocuments.tabs.length;i++) {
        if (EditorService.openDocuments.tabs[i].filepath === newFile.filepath) {
          tab = EditorService.openDocuments.tabs[i];
        }
      }
      EditorService.saveDocument(tab);
      FiletreeService.updateFiletree();
      $log.debug('Saved files at: ' + new Date());
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
  };
  $scope.saveDocument = function (tab) {
    EditorService.saveDocument(tab);
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
  $scope.openSearchBox = function () {
    EditorService.openSearchBox();
  };
}])
.controller('SaveAsModalCtrl', function ($scope, $modalInstance, $http, file) {
  $scope.treeData = {};
  var initialContents = $http
    .get('/filebrowser/filetree/a/dir')
    .success(function(data, status, headers, config) {
      for (var i=0;i<data.length;i++) {
        data[i].children = [];
      }
      $scope.treeData.filetreeContents = data;
    }).
    error(function(data, status, headers, config) {
      $log.error('Failed to initialize filetree.');
    });
    $scope.getDirContents = function (node,expanded) {
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
        }).
        error(function(data, status, headers, config) {
          $log.error('Failed to grab dir contents from ',node.filepath);
        });
  };
  $scope.newFile = {};
  $scope.invalidFilepath = false;
  if (file.filepath.substring(0,1) === '-') {
    $scope.newFile.filepath = '-/';
    $scope.invalidFilepath = true;
  } else {
    var index = file.filepath.lastIndexOf('/')+1;
    var filepath = file.filepath.substring(0,index);
    $scope.newFile.filepath = filepath;
  }
  $scope.newFile.filename = file.filename;
  $scope.newFile.oldFilename = file.filename;
  $scope.newFile.oldFilepath = file.filepath;
  $scope.updateSaveName = function (node, selected) {
    $scope.invalidFilepath = false;
    if (node.type === 'dir') {
      $scope.newFile.filepath = node.filepath;
    } else {
      var index = node.filepath.lastIndexOf('/')+1;
      var filepath = node.filepath.substring(0,index);
      var filename = node.filepath.substring(index,node.filepath.length);
      $scope.newFile.filepath = filepath;
      $scope.newFile.filename = filename;
    }
  };
  $scope.treeOptions = {
    multiSelection: false,
    isLeaf: function(node) {
      return node.type !== 'dir';
    },
    injectClasses: {
      iExpanded: "filetree-icon fa fa-folder-open",
      iCollapsed: "filetree-icon fa fa-folder",
      iLeaf: "filetree-icon fa fa-file",
    }
  };

  $scope.saveAs = function () {
    $scope.newFile.filepath = $scope.newFile.filepath+$scope.newFile.filename;
    $modalInstance.close($scope.newFile);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('UnsavedModalCtrl', function ($scope, $modalInstance, file) {

  $scope.file = file;

  $scope.save = function () {
    $scope.file.saveFile = true;
    $modalInstance.close($scope.file);
  };

  $scope.close = function () {
    $scope.file.saveFile = false;
    $modalInstance.close($scope.file);
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.controller('EditorSettingsCtrl', ['$scope', 'EditorService', function ($scope, EditorService) {
  $scope.editorSettings = EditorService.editorSettings;
  // $scope.editorSettings.fontSize = 12;
  // $scope.editorSettings.tabSize = 4;
  var fontSizes = [];
  var tabSizes = [];
  for (var i=1;i<9;i++) { tabSizes.push(i); }
  for (var i=8;i<21;i+=2) { fontSizes.push(i); }
  $scope.fontOptions = fontSizes;
  $scope.tabOptions = tabSizes;

  $scope.applyEditorSettings = function () {
    EditorService.applyEditorSettings();
  };
}])
.factory('EditorService', ['$window', '$http', '$log', 'AceModeService', 'StateService', function ($window, $http,$log,AceModeService,StateService) {
  var editor = {};
  var clipboard = '';
  var state, openDocuments, editorSessions, editorSettings;
  openDocuments = {
    currentSession: '',
    tabs:[]
  };
  editorSessions = {};
  editorSettings = {
    showInvisibles: true,
    useSoftTabs: true,
    fontSize: 12,
    tabSize: 4,
    showIndentGuides: true
  };
  var onAceLoad = function (_ace) {
    editor = _ace;
    StateService.statePromise.then(function () {
      StateService.registerUnloadFunc(function (state) {
        var currSess;
        var editorSessions = {};
        for (var k in state.editor.editorSessions) {
          currSess = state.editor.editorSessions[k];
          editorSessions[k] = {
            content: currSess.getValue(),
            mode: currSess.$modeId
          };
        }
        state.editor.editorSessions = editorSessions;
      });
      state = StateService.getState();
      if ('openDocuments' in state.editor) {
        openDocuments.tabs = state.editor.openDocuments.tabs;
        openDocuments.currentSession = state.editor.openDocuments.currentSession;
      } else {
        state.editor.openDocuments = openDocuments;
      }
      if ('editorSessions' in state.editor) {
        var s;
        for (var k in state.editor.editorSessions) {
          s = state.editor.editorSessions[k];
          editorSessions[k] = $window.ace.createEditSession(s.content,s.mode);
        }
      }
      state.editor.editorSessions = editorSessions;
      if ('editorSettings' in state.editor) {
        for (var k in state.editor.editorSettings) {
          editorSettings[k] = state.editor.editorSettings[k];
        }
      }
      state.editor.editorSettings = editorSettings;
      applySettings();
      $log.debug('Loaded Ace instance: ', editor);
      editor.on('change', onAceChanged);
      if (openDocuments.tabs.length === 0) {
        createDocument();
      } else {
        editor.setSession(editorSessions[openDocuments.currentSession]);
      }
    });
  };
  var onAceChanged = function (e) {
    for (var i=0;i<openDocuments.tabs.length;i++) {
      if (openDocuments.tabs[i].filepath === openDocuments.currentSession) {
        openDocuments.tabs[i].unsaved = true;
      }
    }
  };
  var applySettings = function () {
    editor.setShowInvisibles(editorSettings.showInvisibles);
    editor.getSession().setUseSoftTabs(editorSettings.useSoftTabs);
    editor.setFontSize(editorSettings.fontSize);
    editor.getSession().setTabSize(editorSettings.tabSize);
    editor.setDisplayIndentGuides(editorSettings.showIndentGuides);
  };
  var switchSession = function (filepath) {
    if (!(openDocuments.currentSession === filepath)) {
      editorSessions[openDocuments.currentSession] = editor.getSession();
      editor.setSession(editorSessions[filepath]);
      $log.debug('Switching sessions from ', openDocuments.currentSession, ' to ', filepath)
      openDocuments.currentSession = filepath;
    }
  };
  var saveSession = function (filepath) {
    var contents = editorSessions[filepath].getValue();
  };
  var createDocument = function () {
    $log.debug('Creating new Document');
    var docExists = true;
    var docEnum = 0;
    var filepath;
    while (docExists) {
      filepath = '-/untitled'+docEnum;
      if (filepath in editorSessions) {
        docEnum++;
      } else {
        docExists = false;
      }
    }
    editorSessions[filepath] = $window.ace.createEditSession('','text');
    openDocuments.tabs.push({
      filename: 'untitled',
      filepath: filepath,
      active: true,
      unsaved: false
    });
    switchSession(filepath);
  };
  var closeDocument = function (tab) {
    $log.debug('Closing editor session: ', tab.filepath);
    openDocuments.tabs.splice(openDocuments.tabs.lastIndexOf(tab),1);
    if (openDocuments.tabs.length !== 0) {
      switchSession(openDocuments.tabs[openDocuments.tabs.length-1].filepath);
    }
    // editorSessions[tab.filepath].$stopWorker();
    delete editorSessions[tab.filepath];
    $log.debug('Closed session.');
  };
  return {
    editorSettings: editorSettings,
    openDocuments: openDocuments,
    onAceLoad: function (_ace) {
      onAceLoad(_ace);
    },
    noOpenSessions: function () {
      return openDocuments.tabs.length === 0;
    },
    fileRenamed: function (oldFilepath, newFilepath) {
      var tab, session;
      for (var i=0;i<openDocuments.tabs.length;i++) {
        if (openDocuments.tabs[i].filepath === oldFilepath) {
          tab = openDocuments.tabs[i];
        }
      }
      if (!(typeof tab === 'undefined')) {
        tab.filepath = newFilepath;
        tab.filename = newFilepath.substring(
          newFilepath.lastIndexOf('/')+1,
          newFilepath.length
        );
      }
      if (oldFilepath in editorSessions) {
        editorSessions[newFilepath] = editorSessions[oldFilepath];
        delete editorSessions[oldFilepath];
        var mode = AceModeService.getModeForPath(newFilepath);
        editorSessions[newFilepath].setMode(mode.mode);
      }
    },
    fileDeleted: function (filepath) {
      var i, tab;
      for (i=0;i<openDocuments.tabs.length;i++) {
        if (openDocuments.tabs[i].filepath === filepath) {
          tab = openDocuments.tabs[i];
          closeDocument(tab);
        }
      }
    },
    loadSession: function (filepath) {
      if (!(filepath in editorSessions)) {
        $log.debug('Creating new EditSession: ', filepath);
        $http
          .get('/filebrowser/localfiles'+filepath)
          .success(function (data, status, headers, config) {
            var mode = AceModeService.getModeForPath(filepath);
            editorSessions[filepath] = $window.ace.createEditSession(data.content,mode.mode);
            openDocuments.tabs.push({
              filename: filepath.substring(filepath.lastIndexOf('/')+1),
              filepath: filepath,
              active: true,
              unsaved: false
            });
            switchSession(filepath);
          })
      } else {
        switchSession(filepath);
      }
    },
    createDocument: function () {
      createDocument();
    },
    closeDocument: function (tab) {
      closeDocument(tab);
    },
    saveDocument: function (tab) {
      var content = editorSessions[tab.filepath].getValue();
      $http
        .get(
          '/filebrowser/a/fileutil',
          {
            params: {
              operation: 'CHECK_EXISTS',
              filepath: tab.filepath
            }
          }
        )
        .success(function (data, status, headers, config) {
          if (data.result) {
            $http({
              url: '/filebrowser/localfiles'+tab.filepath,
              method: 'PUT',
              params: {
                _xsrf: getCookie('_xsrf'),
                content: content
              }
            })
            .success(function (data,status, headers, config) {
              $log.debug('Saved file: ', tab.filepath);
              openDocuments.tabs[openDocuments.tabs.indexOf(tab)].unsaved = false;
            });
          } else {
            $http({
              url: '/filebrowser/localfiles'+tab.filepath,
              method: 'POST',
              params: {
                _xsrf: getCookie('_xsrf')
              }
            })
            .success(function (data,status, headers, config) {
              $http({
                url: '/filebrowser/localfiles'+tab.filepath,
                method: 'PUT',
                params: {
                  _xsrf: getCookie('_xsrf'),
                  content: content
                }
              })
              .success(function (data,status, headers, config) {
                $log.debug('Saved file: ', tab.filepath);
                openDocuments.tabs[openDocuments.tabs.indexOf(tab)].unsaved = false;
              });
            });
          }
        });
    },
    applyEditorSettings: function () {
      applySettings();
    },
    openSearchBox: function () {
      editor.execCommand("replace");
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
.factory('FiletreeService', ['$http', '$document', '$q', '$log', 'EditorService', 'StateService', function($http,$document,$q,$log,EditorService,StateService) {
  // var state = StateService.state;
  var state, treeData, selectionDesc;
  treeData = {
    filetreeContents: [
      // { "type": "dir", "filepath": "/tmp/", "filename" : "tmp", "children" : []}
    ]
  };
  selectionDesc = {
    noSelections: true,
    multipleSelections: false,
    dirSelected: false
  };
  StateService.statePromise.then(function () {
    // state = StateService.getState();
    // if ('treeData' in state.editor) {
    //   treeData = state.editor.treeData;
    //   describeSelection();
    // } else {
    //   state.editor.treeData = treeData;
    // }
    initializeFiletree();
  });
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
    openFilesInEditor: function () {
      for (var i=0;i<treeData.selectedNodes.length;i++) {
        EditorService.loadSession(treeData.selectedNodes[i].filepath);
        $log.debug('Opened document: ', treeData.selectedNodes[i].filepath);
      }
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
            .success(function (data, status, headers, config) {
              $log.debug('Copied: ', data.result);
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
            EditorService.fileDeleted(data.filepath);
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
    },
    renameFile: function (newFileName) {
      var node = treeData.selectedNodes[0];
      $http({
        url: '/filebrowser/a/fileutil',
        method: 'POST',
        params: {
          _xsrf:getCookie('_xsrf'),
          operation: 'RENAME',
          filepath: node.filepath,
          newFileName: newFileName
        }
        })
        .success(function (data, status, headers, config) {
          EditorService.fileRenamed(node.filepath,data.result);
          removeNodeFromFiletree(node);
          updateFiletree();
          $log.debug('POST: ', data.result);
        });
        // removeNodeFromFiletree(node);
        // updateFiletree();
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
  $scope.openFilesInEditor = function () {
    FiletreeService.openFilesInEditor();
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
  $scope.renameFile = function () {
    var renameModalInstance = $modal.open({
      templateUrl: '/static/editor/rename-modal.html',
      backdrop: 'static',
      keyboard: false,
      controller: 'RenameModalCtrl',
      resolve: {
        files: function () {
          return FiletreeService.treeData.selectedNodes;
        }
      }
    });

    renameModalInstance.result.then(function (newFileName) {
      $log.debug('Files renamed at: ' + new Date());
      FiletreeService.renameFile(newFileName);
    }, function () {
      $log.debug('Modal dismissed at: ' + new Date());
    });
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
.controller('RenameModalCtrl', function ($scope, $modalInstance, files) {

  $scope.files = files;
  $scope.newFileName = files[0].filename;

  $scope.rename = function () {
    $modalInstance.close($scope.newFileName);
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
}])
.controller('StateTestCtrl',function($scope,StateService,$log){
  $scope.getState = function () {
    $log.debug('Read state: ', StateService.getState());
  };
  $scope.postState = function () {
    StateService.storeState();
    $log.debug('State POSTed');
  };
});
