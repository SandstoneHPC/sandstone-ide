describe('oide.filesystemservice', function(){
  var $filesystemservice;
  var httpBackend;

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

    beforeEach(inject(function(FilesystemService, $httpBackend){
      $filesystemservice = FilesystemService;

      httpBackend = $httpBackend;
      httpBackend.whenGET('/filebrowser/filetree/a/dir').respond(function(){
        return [200, dirs];
      });
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*&folders=true/).respond(function(){
        return [200, dirs];
      });
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
        return [200, files];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?dirpath=.*&operation=GET_NEXT_UNTITLED_FILE/).respond(function(){
        return [200, {'filepath': '/home/saurabh/Untitled1'}];
      });
      httpBackend.whenPOST(/\/filebrowser\/localfiles.*/).respond(function(){
        return [200, {'filepath': '/home/saurabh/Untitled1'}];
      });
      httpBackend.whenPOST(/\/filebrowser\/localfiles.*/).respond(function(){
        return [200, {'filepath': '/home/saurabh/Untitled1'}];
      });
      httpBackend.whenPOST(/\/filebrowser\/a\/fileutil\?filepath=.*&newFileName=.*&operation=RENAME/).respond(function(){
        return [200, {'filepath': '/home/saurabh/somefile'}];
      });
      httpBackend.when('DELETE', /\/filebrowser\/localfiles.*/).respond(function(){
        return [200, {'result': 'DELETED file'}];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?filepath=.*&operation=GET_NEXT_DUPLICATE/).respond(function(){
        return [200, {'filepath': '/home/saurabh/Untitled12'}];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?filepath=.*&operation=GET_VOLUME_INFO/).respond(function(){
        return [200, {'result': {'percent': 28, 'size': 429, 'used': 117}}];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?filepath=.*&operation=GET_ROOT_DIR/).respond(function(){
        return [200, {'result': '/home/saurabh/'}];
      });
      httpBackend.whenGET(/\/filebrowser\/a\/fileutil\?operation=GET_GROUPS/).respond(function(){
        return [200, ['users', 'ldap']];
      });
      httpBackend.whenPOST(/\/filebrowser\/a\/fileutil\?newpath=.*&operation=COPY&origpath=.*/).respond(function(){
        return [200, {'result': '/home/saurabh/Untitled1-duplicate'}];
      });
    }));

    describe('Functionality of FilesystemService', function(){
      it('should be able to get files', function(){
        $filesystemservice.getFiles(dirs[0], function(data){
          expect(data.length).toBe(2);
        });
        httpBackend.flush();
      });
      it('should be able to get folders', function(){
        $filesystemservice.getFolders(dirs[0], function(data){
          expect(data.length).toBe(3);
        });
        httpBackend.flush();
      });
      it('should be able to get the next untitled file', function(){
        $filesystemservice.getNextUntitledFile(dirs[0], function(data){
          expect(data.filepath).toBeDefined();
        });
        httpBackend.flush();
      });
      it('should be able to create a new file', function(){
        $filesystemservice.createNewFile(files[0].filename, function(data){
          expect(data.filepath).toBeDefined();
        });
        httpBackend.flush();
      });
      it('should be able to rename a file', function(){
        $filesystemservice.renameFile("somefile", files[0], function(data){
          expect(data.filepath).toBeDefined();
        });
        httpBackend.flush();
      });
      it('should be able to delete a file', function(){
        $filesystemservice.deleteFile(files[0].filepath, function(data){
          expect(data.result).toBeDefined();
        });
        httpBackend.flush();
      });
      it('should be able to get the next duplicate filename', function(){
        $filesystemservice.getNextDuplicate(files[0].filepath, function(data){
          expect(data.originalFile).toBeDefined();
          expect(data.filepath).toBe('/home/saurabh/Untitled12');
        });
        httpBackend.flush();
      });
      it('should be able to duplicate a file', function(){
        $filesystemservice.duplicateFile(files[0].filepath, '/home/saurabh/Untitled1-duplicate', function(data){
          expect(data.result).toBeDefined();
          expect(data.result).toBe('/home/saurabh/Untitled1-duplicate');
        });
        httpBackend.flush();
      });
      it('should be able to get the volume info', function(){
        $filesystemservice.getVolumeInfo(files[0].filepath, function(data){
          expect(data.result).toBeDefined();
          expect(data.result.percent).toBe(28);
          expect(data.result.size).toBe(429);
          expect(data.result.used).toBe(117);
        });
        httpBackend.flush();
      });
      it('should be able to get the root directories', function(){
        $filesystemservice.getRootDirectory(files[0].filepath, function(data){
          expect(data.result).toBeDefined();
        });
        httpBackend.flush();
      });
      it('should be able to fetch the groups', function(){
        $filesystemservice.getGroups( function(data){
          expect(data).toBeDefined();
          expect(data.length).toBe(2);
        });
        httpBackend.flush();
      });
    });
});
