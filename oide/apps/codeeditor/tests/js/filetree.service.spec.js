describe('filetree.service', function(){
  var $filetreeService;
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
      });
    });
});
