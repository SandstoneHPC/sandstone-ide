describe('Filebrowser', function() {
  var scope;
  var controller;
  beforeEach(module('oide.filebrowser'));

  describe('FilebrowserController Test', function() {
    var httpBackend;
    var http;
    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      controller = $controller;
      http = $http;

      // Mock FileService
      var currentDirectory = ['/', 'home', 'saurabh'];
      var currentFile = '/home/saurabh/testfile';
      var rootDirectory = '/home/saurabh';
      var volume_info = {
        'percent': '10',
        'used': '10',
        'size': '100'
      };
      var fileData;
      var groups = ['saurabh', 'sudo', 'adm'];

      mockFileService = {
        getCurrentDirectory: function() {
          return currentDirectory;
        },
        getFileData: function() {
          return currentFile;
        },
        getRootDirectory: function() {
          return rootDirectory;
        },
        getVolumeInfo: function() {
          return volume_info;
        },
        setFileData: function(data) {
          fileData = data;
        },
        getFileData: function(){
          return fileData;
        }
      };

      // Mock FilesystemService
      mockFilesystemService = {
        getGroups: function() {
          return groups;
        },
        getFiles: function() {
          http.get('/filebrowser/filetree/a/dir')
          .success(function(data){
            mockFileService.setFileData(data);
          })
          .error(function(data){
            console.log(data);
          });
        }

      };
      // Mock FiletreeService
      mockFiletreeService = {};
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

    afterEach(function(){
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('checks if current directory is set', function() {
      var currentDirectory = mockFileService.getCurrentDirectory();
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
    });

    it('checks if volume info is set', function(){
      expect(scope.ctrl.volumeUsed).toBe('10');
    });

    it('checks if root directory is set', function(){
      expect(mockFileService.getRootDirectory()).toBe('/home/saurabh')
    });

    function is_same(arr1, arr2) {
      return (arr1.length == arr2.length) && arr1.every(function(element, index){
        return element === arr2[index];
      });
    }

    it('should form a correct current dir path', function(){
      var currentDirectory = scope.ctrl.currentDirectory;
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
      expect(scope.ctrl.formDirPath()).toBe('/home/saurabh/');
    });

    it('should fetch files for a particular directory', function(){
      mockFilesystemService.getFiles();
      httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
        var files = [{
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
        return [200, files];
      });
      httpBackend.flush();
      expect(scope.ctrl.fileData).toBeDefined();
      // Length of filedata should be 3
      expect(scope.ctrl.fileData.length).toBe(3);
    });

  });
});
