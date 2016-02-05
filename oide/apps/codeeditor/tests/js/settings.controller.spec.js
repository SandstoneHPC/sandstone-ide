describe('oide.editor settings', function(){
  var scope;
  var $editorService;
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));

  beforeEach(inject(function($controller, $rootScope, EditorService){
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
        showIndentGuides: true
      };
      expect($editorService.getSettings()).toEqual(settings);
    });
  });

});
