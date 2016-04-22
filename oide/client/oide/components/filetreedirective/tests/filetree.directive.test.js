describe('Filetree directive', function(){
  var $compile;
  var scope;
  var element;
  var httpBackend;
  var rootScope;
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

  beforeEach(inject(function($rootScope, _$compile_, $httpBackend){
    $compile = _$compile_;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;

    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, dirs];
    });

    scope.$apply();
  }));

  describe('Filetreedirective tests', function(){
    it('should be initialized properly', function(){
      var el = angular.element('<div oide-filetree tree-data="ctrl.treeData" leaf-level="file" selection-desc="ctrl.sd"></div>');
      element = $compile(el)(scope);
      scope.$digest();
      httpBackend.flush();

      // Get isolate scope and run expects
      var isolateScope = element.isolateScope();
      expect(isolateScope.leafLevel).toBe("file");
      expect(isolateScope.selectionDesc.noSelections).toBeTruthy();
      expect(isolateScope.selectionDesc.multipleSelections).not.toBeTruthy();
      expect(isolateScope.selectionDesc.dirSelected).not.toBeTruthy();
      expect(isolateScope.treeData.filetreeContents.length).toBe(3);
    });
  });

});
