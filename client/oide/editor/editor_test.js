'use strict';

describe('oide.editor module', function() {

  beforeEach(module('oide.editor'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('EditorCtrl', function(){

    var $scope, controller, mockEditorService;

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
});
