describe('Filebrowser', function() {
  beforeEach(module('oide.filebrowser'));

  describe('FilebrowserController Test', function() {
    var $controller, $rootScope;

    beforeEach(inject(function(_$controller_, _$rootScope_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
      $scope = $rootScope.$new();
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
        volumeInfo: function() {
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
        'FilebrowserController', {
          $scope: $scope,
          FileService: mockFileService,
          FilesystemService: mockFilesystemService,
          FBFiletreeService: mockFiletreeService,
          $modal: {}
        });
    });

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

  });
});
