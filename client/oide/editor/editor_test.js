'use strict';

describe('oide.editor module', function() {

  beforeEach(module('oide.editor'));

  describe('EditorCtrl', function(){

    var $scope, controller, mockEditorService;

    var $controller;

    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    beforeEach(function() {
      $scope = {};
      mockEditorService = {
        _ace: {a: 'a'},
        onAceLoad: jasmine.createSpy()
      };
      controller = $controller(
        'EditorCtrl', {
          $scope: $scope,
          EditorService: mockEditorService
        });
    });

    it('should be defined', function() {
      expect(controller).toBeDefined();
    });

    it('should pass _ace object back to EditorService', function() {
      $scope.onAceLoad($scope._ace);
      expect(mockEditorService.onAceLoad).toHaveBeenCalledWith($scope._ace);
    });

  });

  describe('EditorTabsCtrl', function() {

    var $scope, controller, mockEditorService;

    var $controller;

    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    beforeEach(function() {
      $scope = {
        tab: {
          filepath: '/path/to/file'
        }
      };
      mockEditorService = {
        loadSession: jasmine.createSpy(),
        undoChanges: jasmine.createSpy(),
        redoChanges: jasmine.createSpy(),
        copySelection: jasmine.createSpy(),
        cutSelection: jasmine.createSpy(),
        pasteClipboard: jasmine.createSpy(),
        commentSelection: jasmine.createSpy()
      };
      controller = $controller(
        'EditorTabsCtrl', {
          $scope: $scope,
          EditorService: mockEditorService
        });
    });

    it('should be defined', function() {
      expect(controller).toBeDefined();
    });

    it('$scope.loadEditorContents should call EditorService.loadSession with proper filepath', function() {
      $scope.loadEditorContents($scope.tab);
      expect(mockEditorService.loadSession).toHaveBeenCalledWith('/path/to/file');
    });

    it('$scope.undoChanges should call EditorService.undoChanges with proper filepath', function() {
      $scope.undoChanges($scope.tab);
      expect(mockEditorService.undoChanges).toHaveBeenCalledWith('/path/to/file');
    });

    it('$scope.redoChanges should call EditorService.redoChanges with proper filepath', function() {
      $scope.redoChanges($scope.tab);
      expect(mockEditorService.redoChanges).toHaveBeenCalledWith('/path/to/file');
    });

    it('$scope.copySelection should call EditorService.copySelection with no arguments', function() {
      $scope.copySelection();
      expect(mockEditorService.copySelection).toHaveBeenCalledWith();
    });

    it('$scope.cutSelection should call EditorService.cutSelection with no arguments', function() {
      $scope.cutSelection();
      expect(mockEditorService.cutSelection).toHaveBeenCalledWith();
    });

    it('$scope.pasteClipboard should call EditorService.pasteClipboard with no arguments', function() {
      $scope.pasteClipboard();
      expect(mockEditorService.pasteClipboard).toHaveBeenCalledWith();
    });

    it('$scope.commentSelection should call EditorService.commentSelection with no arguments', function() {
      $scope.commentSelection();
      expect(mockEditorService.commentSelection).toHaveBeenCalledWith();
    });

  });

  describe('EditorFindCtrl', function() {

    var $scope, controller, mockEditorService;

    var $controller;

    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    beforeEach(function() {
      $scope = {
        findNeedle: 'string_to_find',
        replaceNeedle: 'replace_with'
      };
      mockEditorService = {
        findOptions: {
          backwards: false,
          wrap: true,
          caseSensitive: false,
          wholeWord: false,
          regExp: false
        },
        findString: jasmine.createSpy(),
        findPreviousString: jasmine.createSpy(),
        replaceCurrentString: jasmine.createSpy(),
        replaceAllStrings: jasmine.createSpy()
      };
      controller = $controller(
        'EditorFindCtrl', {
          $scope: $scope,
          EditorService: mockEditorService
        });
    });

    it('should be defined', function() {
      expect(controller).toBeDefined();
    });

    it('$scope.findOptions pulls initial values from EditorService.findOptions', function() {
      expect($scope.findOptions)
        .toEqual({
          backwards: false,
          wrap: true,
          caseSensitive: false,
          wholeWord: false,
          regExp: false
        });
    });

    it('$scope.findString() calls EditorService.findString() with proper needle', function() {
      $scope.findString();
      expect(mockEditorService.findString).toHaveBeenCalledWith('string_to_find');
    });

    it('$scope.findPreviousString() calls EditorService.findPreviousString() with proper needle', function() {
      $scope.findPreviousString();
      expect(mockEditorService.findPreviousString).toHaveBeenCalledWith('string_to_find');
    });

    it('$scope.replaceCurrentString() calls EditorService.replaceCurrentString() with proper needle', function() {
      $scope.replaceCurrentString();
      expect(mockEditorService.replaceCurrentString).toHaveBeenCalledWith('replace_with');
    });

    it('$scope.replaceAllStrings() calls EditorService.replaceAllStrings() with proper needle', function() {
      $scope.replaceAllStrings();
      expect(mockEditorService.replaceAllStrings).toHaveBeenCalledWith('replace_with');
    });

  });

  describe('EditorSettingsCtrl', function() {
    var $scope, controller, mockEditorService;

    var $controller;

    beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
    }));

    beforeEach(function() {
      $scope = {};
      mockEditorService = {
        editorSettings: {
          showInvisibles: true,
          useSoftTabs: true,
          fontSize: {label:12, value:12},
          tabSize: {label:4, value:4},
          showIndentGuides: true
        },
        applyEditorSettings: jasmine.createSpy()
      };
      controller = $controller(
        'EditorSettingsCtrl', {
          $scope: $scope,
          EditorService: mockEditorService
        });
    });

    it('should be defined', function() {
      expect(controller).toBeDefined();
    });

    it('$scope.editorSettings pulls initial values from EditorService.editorSettings', function() {
      expect($scope.editorSettings)
        .toEqual({
          showInvisibles: true,
          useSoftTabs: true,
          fontSize: {label:12, value:12},
          tabSize: {label:4, value:4},
          showIndentGuides: true
        });
    });

    it('should set $scope.fontOptions properly on load', function() {
      expect($scope.fontOptions).toEqual([
        {label:8, value:8},
        {label:10, value:10},
        {label:12, value:12},
        {label:14, value:14},
        {label:16, value:16},
        {label:18, value:18},
        {label:20, value:20}
      ]);
    });

    it('should set $scope.tabOptions properly on load', function() {
      expect($scope.tabOptions).toEqual([
        {label:1, value:1},
        {label:2, value:2},
        {label:3, value:3},
        {label:4, value:4},
        {label:5, value:5},
        {label:6, value:6},
        {label:7, value:7},
        {label:8, value:8}
      ]);
    });

    it('$scope.applyEditorSettings() should call EditorService.applyEditorSettings()', function() {
      $scope.applyEditorSettings();
      expect(mockEditorService.applyEditorSettings).toHaveBeenCalledWith();
    });

  });

  describe('EditorService', function() {

    var service, createService;

    beforeEach(inject(function($injector) {
      createService = function() {
        return $injector.get(
          'EditorService',
          {
            $window: {}
          });
      }
    }));

    beforeEach(function() {
      service = createService();
    });

    beforeEach(function() {
      service.editor = {
        setShowInvisibles: jasmine.createSpy(),
        getSession: function() {
          return {
            setUseSoftTabs: jasmine.createSpy(),
            setTabSize: jasmine.createSpy()
          }
        },
        setFontSize: jasmine.createSpy(),
        setDisplayIndentGuides: jasmine.createSpy()
      };
    });

    it('should be defined', function() {
      expect(service).toBeDefined();
    });

    it('should initialize with the proper editorSettings', function() {
      expect(service.editorSettings).toEqual({
        showInvisibles: true,
        useSoftTabs: true,
        fontSize: {label:12, value:12},
        tabSize: {label:4, value:4},
        showIndentGuides: true
      });
    });

  });

});
