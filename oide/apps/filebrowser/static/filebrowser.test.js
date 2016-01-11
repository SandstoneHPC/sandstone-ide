describe('Filebrowser', function() {
  var scope;
  var controller;
  beforeEach(module('oide.filebrowser'));

  describe('FilebrowserController Test', function() {
    var httpBackend;
    beforeEach(inject(function($controller, $rootScope, $httpBackend, $http){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      controller = $controller;
      // httpBackend.when('GET', )

      // Mock FileService
      var currentDirectory = ['/', 'home', 'saurabh'];
      var currentFile = '/home/saurabh/testfile';
      var rootDirectory = '/home/saurabh';
      var volume_info = {
        'percent': '10',
        'used': '10',
        'size': '100'
      };
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
        }
      };

      // Mock FilesystemService
      mockFilesystemService = {
        getGroups: function() {
          return groups;
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
        scope.$apply();
    }));

    function is_same(arr1, arr2) {
      return (arr1.length == arr2.length) && arr1.every(function(element, index){
        return element === arr2[index];
      });
    }

    it('checks if current directory is set', function() {
      var currentDirectory = mockFileService.getCurrentDirectory();
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
    });

    it('checks if volume info is set', function(){
      expect(mockFileService.getVolumeInfo().used).toBe('10');
    });

    it('checks if root directory is set', function(){
      expect(mockFileService.getRootDirectory()).toBe('/home/saurabh')
    });

    it('should form a correct current dir path', function(){
      var currentDirectory = scope.ctrl.currentDirectory;
      var ref = ['/', 'home', 'saurabh'];
      var are_directories_same = is_same(currentDirectory, ref);
      expect(are_directories_same).toBeTruthy();
      expect(scope.ctrl.formDirPath()).toBe('/home/saurabh/');
    });

  });
});
