'use strict';

angular.module('oide.editor')

.factory('EditorService', ['$window', '$http', '$log', 'AceModeService', 'StateService', function ($window, $http,$log,AceModeService,StateService) {
  var editor = {};
  var clipboard = '';
  var state, openDocuments, editorSessions, editorSettings;
  var aceModel = {content:'',mode:'text'};
  var loadLock = false;
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
  var loadState = function() {
    if (openDocuments.currentSession==='') {
      // StateService.registerUnloadFunc(function (state) {
      //   var currSess;
      //   var editorSessions = {};
      //   for (var k in state.editor.editorSessions) {
      //     currSess = state.editor.editorSessions[k];
      //     editorSessions[k] = {
      //       content: currSess.getValue(),
      //       mode: currSess.$modeId
      //     };
      //   }
      //   state.editor.editorSessions = editorSessions;
      // });
      var k;
      var od = StateService.getKey('editor_openDocuments');
      if (od) {
        openDocuments.tabs = od.tabs;
        openDocuments.currentSession = od.currentSession;
      }
      var ed = StateService.getKey('editor_editorSessions');
      if (ed) {
        var s;
        for (k in ed) {
          s = ed[k];
          editorSessions[k] = $window.ace.createEditSession(s.content,s.mode);
        }
      }
      var edSett = StateService.getKey('editor_editorSettings');
      if (edSett) {
        for (k in edSett) {
          editorSettings[k] = edSett[k];
        }
      }
    }
  };
  var onAceLoad = function (_ace) {
    if (!loadLock) {
      editor = _ace;
      // loadState();
      applySettings();
      // editor.on('change', onAceChanged);
      $log.debug('Loaded Ace instance: ', editor);
      if (openDocuments.tabs.length === 0) {
        createDocument();
      } else {
        switchSession(openDocuments.currentSession);
        aceModel.content = editorSessions[openDocuments.currentSession].getValue();
      }
      loadLock = true;
    } else {
      if (openDocuments.tabs.length !== 0) {
        aceModel.content = editorSessions[openDocuments.currentSession].getValue();
      }
    }
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
    if (openDocuments.currentSession !== filepath) {
      if (openDocuments.currentSession !== '') {
        editorSessions[openDocuments.currentSession] = editor.getSession();
      }
      editor.setSession(editorSessions[filepath]);
      $log.debug('Switching sessions from ', openDocuments.currentSession, ' to ', filepath);
      openDocuments.currentSession = filepath;
      for (var i=0;i<openDocuments.tabs.length;i++) {
        if (openDocuments.tabs[i].filepath === filepath) {
          openDocuments.tabs[i].active = true;
        }
      }
      aceModel.content = editorSessions[openDocuments.currentSession].getValue();
      aceModel.mode = editorSessions[openDocuments.currentSession].$modeId.split("/").slice(-1)[0];
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
    editorSessions[filepath].on('change',onAceChanged);
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
    } else {
      openDocuments.currentSession = undefined;
    }
    // editorSessions[tab.filepath].$stopWorker();
    delete editorSessions[tab.filepath];
    $log.debug('Closed session.');
  };
  return {
    aceModel: aceModel,
    editorSettings: editorSettings,
    openDocuments: openDocuments,
    onAceLoad: function (_ace) {
      onAceLoad(_ace);
    },
    onAceChanged: function(e) {
      onAceChanged(e);
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
      if (typeof tab !== 'undefined') {
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
            editorSessions[filepath].on('change',onAceChanged);
            openDocuments.tabs.push({
              filename: filepath.substring(filepath.lastIndexOf('/')+1),
              filepath: filepath,
              active: true,
              unsaved: false
            });
            switchSession(filepath);
          });
      } else {
        switchSession(filepath);
        for (var i=0;i<openDocuments.tabs.length;i++) {
          if (openDocuments.tabs[i].filepath === filepath) {
            openDocuments.tabs[i].active = true;
          }
        }
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
                _xsrf: getCookie('_xsrf')
              },
              data: {'content': content}
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
                  _xsrf: getCookie('_xsrf')
                },
                data: {'content': content}
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
}]);
