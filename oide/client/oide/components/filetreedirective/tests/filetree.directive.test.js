describe('Filetree directive', function(){
  var $compile;
  var scope;
  var element;
  var httpBackend;
  var rootScope;
  var filesystemservice;
  var isolateScope;
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

  beforeEach(inject(function($rootScope, _$compile_, $httpBackend, FilesystemService){
    $compile = _$compile_;
    scope = $rootScope.$new();
    rootScope = $rootScope;
    httpBackend = $httpBackend;
    filesystemservice = FilesystemService;

    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, dirs];
    });
    scope.$apply();
    var el = angular.element('<div oide-filetree tree-data="ctrl.treeData" leaf-level="file" selection-desc="ctrl.sd"></div>');
    element = $compile(el)(scope);
    scope.$digest();
    httpBackend.flush();

    // Get isolate scope
    isolateScope = element.isolateScope();
  }));

  describe('Filetreedirective tests', function(){
    it('should be initialized properly', function(){
      // Create spies
      spyOn(isolateScope, 'updateFiletree');
      spyOn(isolateScope, 'deletedFile');
      spyOn(isolateScope, 'pastedFiles');

      expect(isolateScope.leafLevel).toBe("file");
      expect(isolateScope.selectionDesc.noSelections).toBeTruthy();
      expect(isolateScope.selectionDesc.multipleSelections).not.toBeTruthy();
      expect(isolateScope.selectionDesc.dirSelected).not.toBeTruthy();
      expect(isolateScope.treeData.filetreeContents.length).toBe(3);
      // Refresh
      rootScope.$emit('refreshFiletree');
      expect(isolateScope.updateFiletree).toHaveBeenCalled();
      // Deleted File
      rootScope.$emit('deletedFile', dirs[0]);
      expect(isolateScope.deletedFile).toHaveBeenCalled();
      // Pasted File
      rootScope.$emit('pastedFiles', dirs[0].filepath);
      expect(isolateScope.pastedFiles).toHaveBeenCalled();
    });

    it('should show files on expanding', function(){
      spyOn(isolateScope, 'getDirContents');
      spyOn(isolateScope, 'populatetreeContents');
      // Click to toggle
      element.find('i')['0'].click();
      expect(isolateScope.getDirContents).toHaveBeenCalled();
    });

    it('should be able to get files for a folder', function(){
      spyOn(filesystemservice, 'getFiles');
      isolateScope.getDirContents(dirs[0], true);
      expect(filesystemservice.getFiles).toHaveBeenCalled();
    });

  });

});
