function getCookie(name) {
  var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
  return r ? r[1] : undefined;
};

describe('Filebrowser', function() {
  var scope;
  var controller;
  beforeEach(module('oide.filebrowser'));
  beforeEach(module('oide.filesystemservice'));
  // beforeEach(module('FileService'));

  describe('FilebrowserController Test', function() {
    var httpBackend;
    var http;
    var files;
    var groups = ['saurabh', 'sudo', 'adm'];
    var volume_info = {
      'percent': '10',
      'used': '10',
      'size': '100'
    };
    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http, FilesystemService, FileService){
      mockFileService = FileService;
      // The injector unwraps the underscores (_) from around the parameter names when matching
      httpBackend = $httpBackend;
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
        return [200, files];
      });
      httpBackend.whenGET('/filebrowser/a/fileutil?operation=GET_GROUPS').respond(function(){
        return [200, groups];
      });
      httpBackend.whenPOST(/\/filebrowser\/a\/fileutil\?newpath=.*&operation=COPY&origpath=.*/).respond(function(){
        return [200, {'status': 'copied file'}];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?filepath=.*&operation=GET_NEXT_DUPLICATE/).respond(function(){
        return [200, []];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?dirpath=.*&operation=GET_NEXT_UNTITLED_FILE/).respond(function(){
        return [200, []];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?dirpath=.*&operation=GET_NEXT_UNTITLED_DIR/).respond(function(){
        return [200, []];
      });
      scope = $rootScope.$new();
      controller = $controller;
      http = $http;

      // Mock FileService
      var currentDirectory = ['/', 'home', 'saurabh'];
      var currentFile = '/home/saurabh/testfile';
      var rootDirectory = ['/', 'home', 'saurabh'];
      files = [{
        "filepath": "/home/saurabh/file1",
        "filename": "file1",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "0.0 KiB",
        "type": "file"
      }, {
        "filepath": "/home/saurabh/file2",
        "filename": "file2",
        "group": "root",
        "is_accessible": false,
        "perm": "-rw-r--r--",
        "perm_string": "644",
        "size": "0.0 KiB",
        "type": "file"
      },
      {
        "filepath": "/home/saurabh/file3",
        "filename": "file3",
        "group": "saurabh",
        "is_accessible": true,
        "perm": "-rw-rw-r--",
        "perm_string": "664",
        "size": "0.0 KiB",
        "type": "file"
      }];
      var fileData;


      // mockFileService = {
      //   getCurrentDirectory: function() {
      //     return currentDirectory;
      //   },
      //   getFileData: function() {
      //     return currentFile;
      //   },
      //   getRootDirectory: function() {
      //     return rootDirectory;
      //   },
      //   getVolumeInfo: function() {
      //     return volume_info;
      //   },
      //   setFileData: function(data) {
      //     fileData = data;
      //   },
      //   getFileData: function(){
      //     return fileData;
      //   }
      // };

      // Mock FilesystemService
      // mockFilesystemService = {
      //   getGroups: function() {
      //     return groups;
      //   },
      //   getFiles: function() {
      //     http.get('/filebrowser/filetree/a/dir')
      //     .success(function(data){
      //       mockFileService.setFileData(data);
      //     })
      //     .error(function(data){
      //       console.log(data);
      //     });
      //   }
      //
      // };
      mockFilesystemService = FilesystemService;
      // Mock FiletreeService
      mockFiletreeService = {
        updateFiletree: function() {
          console.log('Filetree Refreshed');
        }
      };
      controller = $controller(
        'FilebrowserController as ctrl', {
          $scope: scope,
          FileService: mockFileService,
          FilesystemService: mockFilesystemService,
          FBFiletreeService: mockFiletreeService,
          $modal: {}
        });
        scope.ctrl = controller;
        scope.$apply();
    }));

    it('checks if current directory is set', function() {
      mockFileService.setCurrentDirectory("/home/saurabh/");
      scope.$apply();
      var currentDirectory = mockFileService.getCurrentDirectory();
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
    });

    it('checks if volume info is set', function(){
      mockFileService.setVolumeInfo(volume_info);
      scope.$apply();
      expect(scope.ctrl.volumeUsed).toBe('10');
    });

    it('checks if root directory is set', function(){
      mockFileService.setRootDirectory('/home/saurabh/');
      scope.$apply();
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(scope.ctrl.rootDirectory, ref);
      expect(are_directories_same).toBeTruthy();
    });

    function is_same(arr1, arr2) {
      return (arr1.length == arr2.length) && arr1.every(function(element, index){
        return element === arr2[index];
      });
    }

    it('should form a correct current dir path', function(){
      mockFileService.setCurrentDirectory('/home/saurabh/');
      scope.$apply();
      var currentDirectory = scope.ctrl.currentDirectory;
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
      expect(scope.ctrl.formDirPath()).toBe('/home/saurabh/');
    });

    it('should fetch files for a particular directory', function(){
      mockFilesystemService.getFiles({
        filepath: '/home/saurabh'
      }, function(data){
        // scope.ctrl.fileData = data;
        mockFileService.setFileData(data);
      });
      httpBackend.flush();
      expect(scope.ctrl.fileData).toBeDefined();
      // Length of filedata should be 3
      expect(scope.ctrl.fileData.length).toBe(3);
    });

    it('should show details of an accessible file', function(){
      spyOn(scope.ctrl, 'populatePermissions');
      scope.ctrl.ShowDetails(files[0]);
      // show_details should be set to true
      expect(scope.ctrl.show_details).toBeTruthy();
      // populatePermissions to have been called
      expect(scope.ctrl.populatePermissions).toHaveBeenCalled();
    });

    it('should not show details of an inaccessible file', function(){
      spyOn(scope.ctrl, 'populatePermissions');
      scope.ctrl.ShowDetails(files[1]);
      // show_details should be set to false
      expect(scope.ctrl.show_details).not.toBeTruthy();
      // populatePermissions should not have been called
      expect(scope.ctrl.populatePermissions).not.toHaveBeenCalled();
    });

    it('should populate permissions for the selected file', function(){
      // Set a file as the selected file on the scope
      scope.ctrl.selectedFile = files[0];
      scope.ctrl.populatePermissions();
      // Expect that self.currentFilePermissions would be defined
      expect(scope.ctrl.currentFilePermissions).toBeDefined();
      // Permission should be as expected
      expect(scope.ctrl.currentFilePermissions['user']['r']).toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['user']['w']).toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['user']['x']).not.toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['group']['r']).toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['group']['w']).toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['group']['x']).not.toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['others']['r']).toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['others']['w']).not.toBeTruthy();
      expect(scope.ctrl.currentFilePermissions['others']['x']).not.toBeTruthy();
    });

    it('should refresh the directory', function(){
      // set current directory
      scope.ctrl.currentDirectory = ['/', 'home', 'saurabh'];
      spyOn(mockFilesystemService, 'getFiles');
      scope.ctrl.refreshDirectory();
      httpBackend.flush();
      // Expect the FilesystemService.getFiles method to be called
      expect(mockFilesystemService.getFiles).toHaveBeenCalled();
      // Expect self.fileData to be defined
      // expect(scope.ctrl.fileData).toBeDefined();
    });

    it('should be able to change the directory', function(){
      // Set the current directory
      scope.ctrl.currentDirectory = ['/', 'home', 'saurabh', 'workspace', 'oide'];
      // Navigate to /home/saurabh
      scope.ctrl.changeDir(2);
      httpBackend.flush();
      // Expect the current directory to be /home/saurabh
      expect(scope.ctrl.formDirPath()).toBe("/home/saurabh/");
    });

    it('should not be able to navigate below the root directory', function(){
      // Set the current directory
      scope.ctrl.currentDirectory = ['/', 'home', 'saurabh', 'workspace', 'oide'];
      // navigate to /home/
      scope.ctrl.changeDir(1);
      // Expect the current directory to be /home/saurabh/workspace/oide
      expect(scope.ctrl.formDirPath()).toBe('/home/saurabh/workspace/oide/');
    });

    it('should be able to copy a file', function(){
      scope.ctrl.selectedFile = files[0];
      scope.ctrl.copyFile();
      //expect isCopied to be true
      expect(scope.ctrl.isCopied).toBeTruthy();
      //expect copied file to be same as selected file
      expect(scope.ctrl.copiedFile).toBe(scope.ctrl.selectedFile);
    });

    it('should be able to paste a file', function(){
      scope.ctrl.currentDirectory = ['/', 'home', 'saurabh'];
      scope.ctrl.selectedFile = files[0];
      scope.ctrl.copyFile();
      // Paste file
      scope.ctrl.pasteFile();
      httpBackend.flush();
      expect(scope.ctrl.isCopied).not.toBeTruthy();
    });

    it('should be able to duplicate a file', function(){
      // Set current Directory
      scope.ctrl.setCurrentDirectory = ['/', 'home', 'saurabh'];
      scope.ctrl.refreshDirectory();
      httpBackend.flush();
      scope.ctrl.selectedFile = files[0];
      // Get length of current array
      var initial_length = scope.ctrl.fileData.length;
      // Duplicate file

      httpBackend.expectPOST(/\/filebrowser\/a\/fileutil\?operation=COPY&origpath=.*/).respond(function(){
        // Duplicate first element of files
        var element = files[0];
        files.push(element);
        return [200, {'status': 'copied file'}];
      });

      scope.ctrl.duplicateFile();
      httpBackend.flush();
      var new_length = scope.ctrl.fileData.length;
      expect(initial_length).toBe(new_length - 1);
    });

    it('should be able to create a new file', function(){
      // Set current Directory
      scope.ctrl.setCurrentDirectory = ['/', 'home', 'saurabh'];
      scope.ctrl.refreshDirectory();
      httpBackend.flush();
      scope.ctrl.selectedFile = files[0];
      // Get length of current array
      var initial_length = scope.ctrl.fileData.length;
      // Create New file

      httpBackend.expectPOST(/\/filebrowser\/localfiles.*/).respond(function(){
        // Duplicate first element of files
        var element = {filepath: '/home/saurabh', filename: 'newfile'};
        files.push(element);
        return [200, {'status': 'created new file'}];
      });

      scope.ctrl.createNewFile();
      httpBackend.flush();
      var new_length = scope.ctrl.fileData.length;
      expect(initial_length).toBe(new_length - 1);
    });

    it('should be able to create a new directory', function(){
      // Set current Directory
      scope.ctrl.setCurrentDirectory = ['/', 'home', 'saurabh'];
      scope.ctrl.refreshDirectory();
      httpBackend.flush();
      scope.ctrl.selectedFile = files[0];
      // Get length of current array
      var initial_length = scope.ctrl.fileData.length;
      // Create New file

      httpBackend.expectPOST(/\/filebrowser\/localfiles.*\?isDir=true/).respond(function(){
        // Duplicate first element of files
        var element = {filepath: '/home/saurabh', filename: 'newfolder'};
        files.push(element);
        return [200, {'status': 'created new file'}];
      });

      scope.ctrl.createNewDirectory();
      httpBackend.flush();
      var new_length = scope.ctrl.fileData.length;
      expect(initial_length).toBe(new_length - 1);
    });

  });
});
