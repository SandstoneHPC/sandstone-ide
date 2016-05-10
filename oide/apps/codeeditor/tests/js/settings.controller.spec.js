describe('oide.editor settings', function(){
  var scope;
  var $editorService;
  var aceMock;
  var sessMock;
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));

  beforeEach(inject(function($controller, $rootScope, EditorService){

    sessMock = jasmine.createSpyObj(
      'sessMock',
      [
        'getUndoManager',
        'setUndoManager',
        'getDocument',
        'setUseSoftTabs',
        'setTabSize',
        'setUseWrapMode'
      ]
    );
    aceMock = jasmine.createSpyObj(
      'aceMock',
      [
        'setSession',
        'setShowInvisibles',
        'setFontSize',
        'setDisplayIndentGuides'
      ]
    );
    aceMock.getSession = function() {
      return sessMock;
    };
    EditorService.onAceLoad(aceMock);
    scope = $rootScope.$new();
    controller = $controller;
    $editorService = EditorService;
    controller = $controller('EditorSettingsCtrl', {
      $scope: scope,
      EditorService: EditorService
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  describe('EditorSettingsCtrl specs', function(){
    it('should load the default settings', function(){
      expect(scope.ctrl.fontOptions).toBeDefined();
      expect(scope.ctrl.fontOptions.length).toBe(7);
      expect(scope.ctrl.tabOptions).toBeDefined();
      expect(scope.ctrl.tabOptions.length).toBe(8);
      expect($editorService.getSettings()).toBeDefined();
      var settings = {
        showInvisibles: true,
        useSoftTabs: true,
        fontSize: 12,
        tabSize:
        4,
        showIndentGuides: true,
        wordWrap: false
      };
      expect($editorService.getSettings()).toEqual(settings);
    });
    it('should be able to set the word wrap', function(){
      scope.ctrl.editorSettings = {
        showInvisibles: true,
        useSoftTabs: true,
        fontSize: 12,
        tabSize:
        4,
        showIndentGuides: true,
        wordWrap: true
      };
      scope.ctrl.applyEditorSettings();
      expect($editorService.getSettings().wordWrap).toBeTruthy();
    });

  });

});
