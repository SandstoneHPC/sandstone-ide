describe('FileService specs', function(){
  var fileService;

  function is_same(arr1, arr2) {
    return (arr1.length == arr2.length) && arr1.every(function(element, index){
      return element === arr2[index];
    });
  }

  beforeEach(module('oide.filebrowser'));
  describe('FileService', function(){
    beforeEach(inject(function(FileService){
      fileService = FileService;
    }));
    it('should set the current directory', function(){
      fileService.setCurrentDirectory("/home/saurabh");
      var is_same_dir = is_same(fileService.getCurrentDirectory(), ['/', 'home', 'saurabh']);
      expect(is_same_dir).toBeTruthy();
    });
    it('should set the root directory', function(){
      fileService.setRootDirectory("/home/saurabh");
      var is_same_dir = is_same(fileService.getRootDirectory(), ['/', 'home', 'saurabh']);
      expect(is_same_dir).toBeTruthy();
    });
  });
});
