'use strict';

describe('sandstone.filebrowser.FilebrowserService', function() {
  var FilesystemService;
  var FilebrowserService;
  var mockResolve;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_FilesystemService_,_FilebrowserService_,_$q_) {
    FilesystemService = _FilesystemService_;
    FilebrowserService = _FilebrowserService_;

    mockResolve = function(data) {
      var deferred = _$q_.defer();
      deferred.resolve(data);
      return deferred.promise;
    };
  }));

  describe('selection methods', function() {

    it('setSelectedFile',function() {});

    it('setCwd',function() {});

    it('setVolume',function() {});

  });

  describe('filewatcher events', function() {

    it('filesystem:file_created',function() {});

    it('filesystem:file_deleted',function() {});

    it('filesystem:file_moved',function() {});

  });

});
