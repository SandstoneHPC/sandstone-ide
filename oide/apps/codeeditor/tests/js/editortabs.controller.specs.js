describe('oide.editor tabs', function(){
  var scope;
  var $editorService;
  var $filetreeService;
  var httpBackend;
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  beforeEach(module('oide.filesystemservice'));

  beforeEach(inject(function($controller, $rootScope, $modal, $log, EditorService, FiletreeService, $httpBackend){
    scope = $rootScope.$new();
    controller = $controller;
    $editorService = EditorService;
    $filetreeService = FiletreeService;
    httpBackend = $httpBackend;
    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, []];
    });
    controller = $controller('EditorTabsCtrl', {
      $scope: scope,
      EditorService: EditorService,
      $modal: $modal,
      $log: $log,
      FiletreeService: FiletreeService
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  describe('tabs controller specs', function(){
    it('EditorService should be defined', function(){
      httpBackend.flush();
      expect($editorService).toBeDefined();
    });
    it('get open docs should be called', function(){
      httpBackend.flush();
      spyOn($editorService, 'getOpenDocs');
      scope.ctrl.getOpenDocs();
      expect($editorService.getOpenDocs).toHaveBeenCalled();
    });
    it('should open doc', function(){
      httpBackend.flush();
      spyOn($editorService, 'openDocument');
      scope.ctrl.openDocument('/home/saurabh/file1');
      expect($editorService.openDocument).toHaveBeenCalled();
    });
  });
});
