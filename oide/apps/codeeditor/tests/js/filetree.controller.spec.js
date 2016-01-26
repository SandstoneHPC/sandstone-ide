describe('filetree', function(){
  var controller;
  var $filetreeService;
  var filetreeCtrl;
  var httpBackend;
  var dirs = [{
        "filepath": "/home/saurabh/dir2",
        "filename": "dir2",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "4.0 KiB",
        "type": "dir"
      }, {
        "filepath": "/home/saurabh/dir2",
        "filename": "dir2",
        "group": "root",
        "is_accessible": false,
        "perm": "-rw-r--r--",
        "perm_string": "644",
        "size": "4.0 KiB",
        "type": "dir"
      },
      {
        "filepath": "/home/saurabh/dir3",
        "filename": "dir3",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "4.0 KiB",
        "type": "dir"
      }];
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));

  beforeEach(inject(function($controller, $rootScope, $log, $document, FiletreeService, $httpBackend){
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, dirs];
    });
    controller = $controller;
    $filetreeService = FiletreeService;
    filetreeCtrl = $controller('FiletreeCtrl', {
      $scope: scope,
      $document: $document,
      $log: $log,
      FileTreeService: $filetreeService
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  //Expect Filetree service to be defined
  describe('Whether the filetree is working as expected or not', function(){
    it('Controller initialization should be proper', function(){
      httpBackend.flush();
      expect($filetreeService).toBeDefined();
      expect($filetreeService.treeData).toBeDefined();
    });
  });

});
