describe('fbfiletree.service', function(){
  var $filetreeService;
  var $filesystemService;
  var httpBackend;
  var selectionDesc = {
      noSelections: true,
      multipleSelections: false,
      dirSelected: false
    };
  var dirs = [{
        "filepath": "/home/saurabh/dir1",
        "filename": "dir1",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "4.0 KiB",
        "type": "dir",
        "children": []
      }, {
        "filepath": "/home/saurabh/dir2",
        "filename": "dir2",
        "group": "root",
        "is_accessible": false,
        "perm": "-rw-r--r--",
        "perm_string": "644",
        "size": "4.0 KiB",
        "type": "dir",
        "children": []
      },
      {
        "filepath": "/home/saurabh/dir3",
        "filename": "dir3",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "4.0 KiB",
        "type": "dir",
        "children": []
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
    beforeEach(module('oide.filebrowser'));
    beforeEach(module('oide.filesystemservice'));

    beforeEach(inject(function(FBFiletreeService, $httpBackend, FilesystemService){
      $filetreeService = FBFiletreeService;
      $filesystemService = FilesystemService;
      httpBackend = $httpBackend;
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*&folders=true/).respond(function(){
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
        expect($filetreeService.treeData.filetreeContents[0].children.length).toBe(3);
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
        expect($filetreeService.treeData.filetreeContents[0].children.length).toBe(3);
      });
      it('should open files in editor', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [$filetreeService.treeData.filetreeContents[0], $filetreeService.treeData.filetreeContents[1]];
        expect($filetreeService.openFilesInEditor().length).toBe(2);
      });
      it('should be able to create a new file', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [dirs[0]];
        $filetreeService.treeData.expandedNodes = [dirs[0]];
        httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?dirpath=.*&operation=GET_NEXT_UNTITLED_FILE/).respond(function(){
          return [200, {result: '/home/saurabh/Untitled3'}];
        });
        httpBackend.whenPOST(/\/filebrowser\/localfiles.*/).respond(function(){
          return [200, {result: 'Created New File'}];
        });
        httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
          return [200, files];
        });
        $filetreeService.createNewFile();
        httpBackend.flush();
        expect(dirs[0].children.length).toBe(3);
      });
      it('should be able to create a new directory', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [dirs[0]];
        $filetreeService.treeData.expandedNodes = [dirs[1]];
        spyOn($filesystemService, 'createNewDir');
        httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?dirpath=.*&operation=GET_NEXT_UNTITLED_DIR/).respond(function(){
          return [200, {result: '/home/saurabh/UntitledDir3'}];
        });
        $filetreeService.createNewDir();
        httpBackend.flush();
        expect($filesystemService.createNewDir).toHaveBeenCalled();
      });
      it('should be able to create a duplicate file or folder', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [files[0]];
        $filetreeService.treeData.expandedNodes = [files[0]];
        spyOn($filesystemService, 'duplicateFile');
        httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?filepath=.*&operation=GET_NEXT_DUPLICATE/).respond(function(){
          return [200, {result: '/home/saurabh/file1-duplicate'}];
        });
        $filetreeService.createDuplicate();
        httpBackend.flush();
        expect($filesystemService.duplicateFile).toHaveBeenCalled();
      });
      it('should be able to delete files', function(){
        httpBackend.flush();
        // If no file is selected, then the deleteFile method of FilesystemService will not be called
        $filetreeService.treeData.selectedNodes = [];
        spyOn($filesystemService, 'deleteFile');
        $filetreeService.deleteFiles();
        expect($filesystemService.deleteFile).not.toHaveBeenCalled();
        // If at least one file is selected, then the deleteFile method of FilesystemService will be called
        $filetreeService.treeData.selectedNodes = [files[0]];
        $filetreeService.deleteFiles();
        expect($filesystemService.deleteFile).toHaveBeenCalled();
      });
      it('should be able to paste files', function(){
        httpBackend.flush();
        $filetreeService.treeData.selectedNodes = [dirs[0]];
        $filetreeService.treeData.expandedNodes = [dirs[0]];
        // Create spies
        spyOn($filesystemService, 'pasteFile');
        spyOn($filetreeService, 'updateFiletree');
        // Add some files to the clipboard
        $filetreeService.copyFiles();
        $filetreeService.pasteFiles();
        expect($filesystemService.pasteFile).toHaveBeenCalled();
      });
      it('should be able to rename files', function(){
        httpBackend.flush();
        spyOn($filesystemService, 'renameFile');
        $filetreeService.renameFile("newfile", files[0]);
        expect($filesystemService.renameFile).toHaveBeenCalled();
      });
    });
});
