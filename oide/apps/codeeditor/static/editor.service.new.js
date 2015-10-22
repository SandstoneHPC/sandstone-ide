'use strict';

/**
 * @ngdoc service
 * @name oide.EditorService
 * @description
 * # EditorService
 * Service to manage documents in the OIDE Editor.
 */
angular.module('oide.editor')

.factory('EditorService', ['$window', '$http', '$log', 'AceModeService', 'StateService', function ($window, $http,$log,AceModeService,StateService) {
  var editor = {};
  /**
   * This is the object from which all values concerning open documents are derived.
   * This objects has the following format:
   * {
   *   '<filepath>': {
   *     filename: str,
   *     unsaved: boolean,
   *     active: boolean,
   *     session: obj (defined by Ace)
   *   },
   *   ...
   * }
   */
  var openDocs = {};
  var editorSettings = {
    showInvisibles: true,
    useSoftTabs: true,
    fontSize: 12,
    tabSize: 4,
    showIndentGuides: true
  };
  
  var applySettings = function () {
    editor.setShowInvisibles(editorSettings.showInvisibles);
    editor.getSession().setUseSoftTabs(editorSettings.useSoftTabs);
    editor.setFontSize(editorSettings.fontSize);
    editor.getSession().setTabSize(editorSettings.tabSize);
    editor.setDisplayIndentGuides(editorSettings.showIndentGuides);
  };
  
  return {
    /**
     * Called when ace editor has loaded. Must be bound to directive by controller.
     */
    onAceLoad: function(_ace) {
      editor = _ace;
    },
    /**
     * Called when the contents of the current session have changed. Bound directly to
     * EditSession.
     */
    onSessionChanged: function(e) {
      
    },
    /**
     * return a list of open documents in the editor.
     * The objects in the list are in the format:
     * {
     *   filepath: str,
     *   filename: str,
     *   unsaved: boolean,
     *   active: boolean,
     * }
     */
    getOpenDocs: function() {
      
    },
    setOpenDocs: function(tabs) {
      
    },
    /**
     * The following methods get/set editor settings. The editor settings object
     * is in the following format, with defaults indicated:
     * {
     *   showInvisibles: true,
     *   useSoftTabs: true,
     *   fontSize: 12,
     *   tabSize: 4,
     *   showIndentGuides: true
     * }
     */
    getSettings: function() {
      return editorSettings;
    },
    setSettings: function(settings) {
      editorSettings = settings;
      applySettings();
    },
    /**
     * @ngdoc
     * @name oide.EditorService#openDocument
     * @methodOf oide.EditorService
     *
     * @description
     * Method to open a document in the editor.
     * @example
     * EditorService.openDocument('/path/to/file');
     * @param {str} [filepath] If called with a filepath, that document will be opened or switched to,
     * otherwise a new document will be created and switched to.
     * @returns {str} returns filepath of opened document, or return undefined if opening fails.
     */
    openDocument: function(filepath) {
      
    },
    /**
     * @ngdoc
     * @name oide.EditorService#closeDocument
     * @methodOf oide.EditorService
     *
     * @description
     * Method to close an open document in the editor.
     * @example
     * EditorService.closeDocument('/path/to/file');
     * @param {str} filepath Closes the open document identified by filepath.
     * @returns {str} returns filepath of closed document, or return undefined in case of failure.
     */
    closeDocument: function(filepath) {
      
    },
    /**
     * @ngdoc
     * @name oide.EditorService#saveDocument
     * @methodOf oide.EditorService
     *
     * @description
     * Method to save an open document in the editor.
     * @example
     * EditorService.saveDocument('/path/to/file');
     * @param {str} filepath Saves the open document identified by filepath to the filesystem.
     * @returns {str} returns filepath of saved document, or return undefined in case of failure.
     */
    saveDocument: function(filepath) {
      
    },
    openSearchBox: function () {
      editor.execCommand("replace");
    },
    undoChanges: function (filepath) {
      
    },
    redoChanges: function (filepath) {
      
    },
    copySelection: function () {
      
    },
    cutSelection: function () {
      
    },
    pasteClipboard: function () {
      
    },
    commentSelection: function () {
      
    }
  };
}]);
