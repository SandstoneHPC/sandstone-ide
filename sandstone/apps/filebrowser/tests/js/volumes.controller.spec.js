'use strict';

describe('sandstone.filebrowser.VolumesCtrl', function() {
  var FilebrowserService;
  var FilesystemService;
  var ctrl;
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_FilesystemService_,_FilebrowserService_,_$rootScope_,_$controller_) {
    FilesystemService = _FilesystemService_;
    FilebrowserService = _FilebrowserService_;
    $controller = _$controller_;

    $scope = _$rootScope_.$new();
    ctrl = $controller('VolumesCtrl', {$scope:$scope});

  }));

  it('sets new volume upon selection',function() {});

  it('changes selected volume when selection changes',function() {});

});
