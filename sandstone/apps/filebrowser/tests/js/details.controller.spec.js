'use strict';

describe('sandstone.filebrowser.DetailsCtrl', function() {
  var FilesystemService, FilebrowserService, AlertService;
  var ctrl;
  var $controller;
  var $rootScope, $scope;
  var mockResolve, mockReject;

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

    $rootScope = _$rootScope_;

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

  beforeEach(inject(function(_FilebrowserService_,_AlertService_,_$controller_) {
    AlertService = _AlertService_;
    FilebrowserService = _FilebrowserService_;
    $controller = _$controller_;

    $scope = $rootScope.$new();
    ctrl = $controller('DetailsCtrl', {$scope:$scope});

  }));

  describe('breadcrumbs', function() {

    it('are empty when there is no selection',function() {});

    it('change when the selection changes',function() {});

    it('show volume path as a single crumb',function() {});

    it('correctly decompose selected filepath into crumbs',function() {});

    it('change directories when selected',function() {});

  });

  describe('navigation', function() {
    // Double-clicking in Directory Details triggers openDirectory()
    // Single-clicking triggers selectFile

    it('openDirectory selected file if type is file',function() {});

    it('openDirectory changes directory if type is directory',function() {});

  });

  describe('directory actions: create', function() {
    var $modal;

    beforeEach(inject(function(_$modal_) {
      $modal = _$modal_;

      var newFileName = 'filename';
      spyOn($modal,'open').and.callFake(function() {
        return mockResolve(newFileName);
      });
    }));

    it('creates a new file selects it',function() {});

    it('creates a new directory and selects it',function() {});

  });

});
