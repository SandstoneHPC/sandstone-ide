describe('oide.editor settings', function(){
  var scope;
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));

  beforeEach(inject(function($controller, $rootScope, EditorService){
    scope = $rootScope.$new();
    controller = $controller;
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
    });
  });

});
