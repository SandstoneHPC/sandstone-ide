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
      httpBackend.whenGET(/\/filebrowser\/filetree\/a\/dir\?dirpath=.*/).respond(function(){
        return [200, files];
      });
    }));

    describe('Functionality of FilesystemService', function(){
      it('should be able to get files', function(){
        $filesystemservice.getFiles(dirs[0], function(data){
          expect(data.length).toBe(2);
        });
        httpBackend.flush();
      });
    });
});
