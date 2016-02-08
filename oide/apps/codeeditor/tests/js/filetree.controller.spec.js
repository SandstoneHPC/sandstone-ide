describe('filetree', function(){
  var controller;
  var $filetreeService;
  var filetreeCtrl;
  var httpBackend;
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
  var injectClasses = {
    iExpanded: "filetree-icon fa fa-folder-open",
    iCollapsed: "filetree-icon fa fa-folder",
    iLeaf: "filetree-icon fa fa-file",
  }

  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  beforeEach(module('oide.filesystemservice'));

  beforeEach(inject(function($controller, $rootScope, $log, $document, FiletreeService, $httpBackend){
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
      return [200, dirs];
    });
    controller = $controller;
    $filetreeService = FiletreeService;
    controller = $controller('FiletreeCtrl', {
      $scope: scope,
      $document: $document,
      $log: $log,
      FileTreeService: $filetreeService
    });
    scope.ctrl = controller;
    scope.$apply();
  }));

  describe('Whether the filetree is working as expected or not', function(){
    //Expect Filetree service to be defined
    it('Controller initialization should be proper', function(){
      httpBackend.flush();
      expect(scope.ctrl).toBeDefined();
      expect($filetreeService).toBeDefined();
      expect(scope.ctrl.treeData).toBeDefined();
      expect(scope.ctrl.treeData.filetreeContents).toBeDefined();
      expect(scope.ctrl.treeData.filetreeContents.length).toBe(3);
    });

    it('should return directory contents', function(){
      httpBackend.flush();
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
        return [200, files];
      });
      scope.ctrl.getDirContents(scope.ctrl.treeData.filetreeContents[0], true);
      httpBackend.flush();
      // Retrieved files should be set as the childrens object of the 0th node
      expect(scope.ctrl.treeData.filetreeContents[0].children).toBeDefined();
      // Length of the children for the node should be 2
      expect(scope.ctrl.treeData.filetreeContents[0].children.length).toBe(2);
    });

    it('should have valid default treeOptions loaded', function(){
      httpBackend.flush();
      expect(scope.ctrl.treeOptions).toBeDefined();
      expect(scope.ctrl.treeOptions.multiSelection).toBeTruthy();
      expect(scope.ctrl.treeOptions.injectClasses).toEqual(injectClasses);
    });

    it('should add the node to selected nodes if selected', function(){
      httpBackend.flush();
      // Select a file
      scope.ctrl.describeSelection(files[0], true);
      // Should be added to selectedNodes
      expect(scope.ctrl.treeData.selectedNodes.length).toBe(1);
      // Unselect files
      scope.ctrl.describeSelection(files[0], false);
      // selectedNodes should be empty
      expect(scope.ctrl.treeData.selectedNodes.length).toBe(0);
    });

  });

});
