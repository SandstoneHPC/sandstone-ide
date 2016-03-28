describe('filetree', function(){
  var controller;
  var $filetreeService;
  var filetreeCtrl;
  var httpBackend;
  var $compile;
  var dirs = [{
        "filepath": "/home/saurabh/dir1",
        "filename": "dir1",
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

    var files = [{
          "filepath": "/home/saurabh/file1",
          "filename": "file1",
          "group": "saurabh",
          "is_accessible": true,
          "perm": "-rw-rw-r--",
          "perm_string": "664",
          "size": "4.0 KiB",
          "type": "dir"
        }, {
          "filepath": "/home/saurabh/file2",
          "filename": "file2",
          "group": "root",
          "is_accessible": false,
          "perm": "-rw-r--r--",
          "perm_string": "644",
          "size": "4.0 KiB",
          "type": "dir"
        }];

  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  beforeEach(module('oide.filesystemservice'));
  beforeEach(module('oide.templates'));
  beforeEach(module('oide.filetreedirective'));

  beforeEach(inject(function($controller, $rootScope, $log, $document, $httpBackend, _$compile_){
    scope = $rootScope.$new();
    $compile = _$compile_;
    httpBackend = $httpBackend;
    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      console.log("Called now");
      return [200, dirs];
    });
    controller = $controller;
    controller = $controller('FiletreeCtrl', {
      $scope: scope,
      $document: $document,
      $log: $log
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  describe('Whether the filetree is working as expected or not', function(){
    //Expect Filetree service to be defined
    it('Controller initialization should be proper', function(){
      var element = angular.element('<div oide-filetree tree-data="ctrl.treeData" selection-desc="ctrl.sd"></div>');
      el = $compile(element)(scope);
      scope.$digest();
      httpBackend.flush();
      expect(scope.ctrl).toBeDefined();
      expect(scope.ctrl.treeData).toBeDefined();
      expect(scope.ctrl.treeData.filetreeContents).toBeDefined();
      expect(scope.ctrl.treeData.filetreeContents.length).toBe(3);
    });
    it('should have valid default treeOptions loaded', function(){
      var element = angular.element('<div oide-filetree tree-data="ctrl.treeData" selection-desc="ctrl.sd"></div>');
      el = $compile(element)(scope);
      scope.$digest();
      httpBackend.flush();
      console.log(scope.ctrl.sd);
      expect(scope.ctrl.sd).toBeDefined();
      expect(scope.ctrl.sd.multiSelection).toBeTruthy();
    });
  });

});
