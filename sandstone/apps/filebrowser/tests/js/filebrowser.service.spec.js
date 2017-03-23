'use strict';

describe('sandstone.filebrowser.FilebrowserService', function() {
  var FilesystemService;
  var FilebrowserService;
  var AlertService;
  var mockResolve, mockReject;
  var $rootScope, digest;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_FilesystemService_,_$q_,_$rootScope_) {
    mockResolve = function(data) {
      var deferred = _$q_.defer();
      deferred.resolve(data);
      return deferred.promise;
    };
    mockReject = function(data) {
      var deferred = _$q_.defer();
      deferred.reject(data);
      return deferred.promise;
    };

    FilesystemService = _FilesystemService_;
    // FilebrowserService automatically calls FS service methods
    var volumeDetails = {
      available: '11G',
      filepath: '/volume1/',
      size: '18G',
      type: 'volume',
      used: '6.0G',
      used_pct: 36
    };
    var fsDetails = {
      groups: ['testgrp'],
      type: 'filesystem',
      volumes: [volumeDetails]
    };
    spyOn(FilesystemService,'getFilesystemDetails').and.callFake(function() {
      return mockResolve(fsDetails);
    });
  }));

  beforeEach(inject(function(_FilebrowserService_,_AlertService_,_$q_,_$rootScope_) {
    FilebrowserService = _FilebrowserService_;
    AlertService = _AlertService_;
    $rootScope = _$rootScope_;

    digest = function() {
      $rootScope.$digest();
    };
  }));

  describe('selection methods', function() {

    it('setSelectedFile',function() {
      var selection;
      var selectedFile = {'filepath': '/test/file'};
      FilebrowserService.setSelectedFile(selectedFile);
      selection = FilebrowserService.getSelection();
      expect(selection.selectedFile).toBe(selectedFile);
      // Calling with no file should clear selection
      FilebrowserService.setSelectedFile();
      selection = FilebrowserService.getSelection();
      expect(selection.selectedFile).not.toBeDefined();
    });

    it('setCwd',function() {
      var selection;
      var dirDetails = {'filepath':'/test/path'};
      var filepath = '/test/path';
      spyOn(FilesystemService,'getDirectoryDetails').and.callFake(function() {
        return mockResolve(dirDetails);
      });
      spyOn(FilesystemService,'createFilewatcher').and.callFake(function() {
        return mockResolve();
      });
      // CWD should be set, its contents retrieved, and a filewatcher should
      // be created for the dirpath
      FilebrowserService.setCwd(filepath);
      digest();
      expect(FilesystemService.getDirectoryDetails.calls.argsFor(0)).toEqual([filepath,{contents:true}]);
      expect(FilesystemService.createFilewatcher.calls.count()).toEqual(1);
      selection = FilebrowserService.getSelection();
      expect(selection.cwd).toEqual(dirDetails);
      // An alert should be raised on error
      FilesystemService.getDirectoryDetails = jasmine.createSpy().and.callFake(function() {
        return mockReject({},500);
      });
      spyOn(AlertService,'addAlert').and.returnValue('uuid-4444');
      FilebrowserService.setCwd(filepath);
      $rootScope.$digest();
      expect(AlertService.addAlert.calls.count()).toEqual(1);
    });

    it('setVolume',function() {});

  });

  describe('filewatcher events', function() {

    it('filesystem:file_created',function() {});

    it('filesystem:file_deleted',function() {});

    it('filesystem:file_moved',function() {});

  });

});
