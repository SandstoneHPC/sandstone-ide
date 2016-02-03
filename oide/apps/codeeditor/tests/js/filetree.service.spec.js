describe('filetree.service', function(){
  var $filetreeService;
  var httpBackend;
  var selectionDesc = {
      noSelections: true,
      multipleSelections: false,
      dirSelected: false
    };
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

    var files = [{
          "filepath": "/home/saurabh/file1",
          "filename": "file1",
          "group": "saurabh",
          "is_accessible": true,
          "perm": "-rw-rw-r--",
          "perm_string": "664",
          "size": "4.0 KiB",
          "type": "file"
        }, {
          "filepath": "/home/saurabh/file2",
          "filename": "file2",
          "group": "root",
          "is_accessible": false,
          "perm": "-rw-r--r--",
          "perm_string": "644",
          "size": "4.0 KiB",
          "type": "file"
        }];

    beforeEach(module('oide'));
    beforeEach(module('oide.editor'));
    beforeEach(module('oide.filesystemservice'));

    beforeEach(inject(function(FiletreeService, $httpBackend){
      $filetreeService = FiletreeService;

      httpBackend = $httpBackend;
      httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
        return [200, dirs];
      });
    }));

    describe('Functionality of FiletreeService', function(){
      it('should initialize the FiletreeService', function(){
        httpBackend.flush();
        expect($filetreeService).toBeDefined();
        expect($filetreeService.treeData).toBeDefined();
        expect($filetreeService.treeData.filetreeContents).toBeDefined();
        expect($filetreeService.treeData.filetreeContents.length).toBe(3);
        expect($filetreeService.selectionDesc).toEqual(selectionDesc);
      });
      it('should list the directory contents', function(){
        httpBackend.flush();
        httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
          return [200, files];
        });
        $filetreeService.getDirContents($filetreeService.treeData.filetreeContents[0]);
        httpBackend.flush();
        // Retrieved files should be set as the childrens object of the 0th node
        expect($filetreeService.treeData.filetreeContents[0].children).toBeDefined();
        // Length of the children for the node should be 2
        expect($filetreeService.treeData.filetreeContents[0].children.length).toBe(2);
      });
      it('should be able to copy a file to the clipboard', function(){
        httpBackend.flush();
        //$filetreeService.describeSelection($filetreeService.treeData.filetreeContents[0], true);
        $filetreeService.treeData.selectedNodes = [$filetreeService.treeData.filetreeContents[0]];
        $filetreeService.copyFiles();
        expect($filetreeService.clipboardEmpty()).not.toBeTruthy();
      });
      it('should be able to describe the selection for single selection', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [$filetreeService.treeData.filetreeContents[0]];
        $filetreeService.describeSelection();
        expect($filetreeService.selectionDesc.multipleSelections).not.toBeTruthy();
        expect($filetreeService.selectionDesc.noSelections).not.toBeTruthy();
        expect($filetreeService.selectionDesc.dirSelected).toBeTruthy();
      });
      it('should be able to describe the selection for single selected file', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [files[0]];
        $filetreeService.describeSelection();
        expect($filetreeService.selectionDesc.multipleSelections).not.toBeTruthy();
        expect($filetreeService.selectionDesc.noSelections).not.toBeTruthy();
        expect($filetreeService.selectionDesc.dirSelected).not.toBeTruthy();
      });
      it('should be able to describe the selection for multiple selection', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [$filetreeService.treeData.filetreeContents[0], $filetreeService.treeData.filetreeContents[1]];
        $filetreeService.describeSelection();
        expect($filetreeService.selectionDesc.multipleSelections).toBeTruthy();
        expect($filetreeService.selectionDesc.noSelections).not.toBeTruthy();
        expect($filetreeService.selectionDesc.dirSelected).toBeTruthy();
      });
      it('should be able to update the filetree', function(){
        httpBackend.flush();
        $filetreeService.treeData.expandedNodes = [$filetreeService.treeData.filetreeContents[0]];
        httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
          return [200, files];
        });
        $filetreeService.updateFiletree();
        httpBackend.flush();
        expect($filetreeService.treeData.filetreeContents[0].children.length).toBe(2);
      });
      it('should open files in editor', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [$filetreeService.treeData.filetreeContents[0], $filetreeService.treeData.filetreeContents[1]];
        expect($filetreeService.openFilesInEditor().length).toBe(2);
      });
    });
});
