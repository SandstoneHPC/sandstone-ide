'use strict';

describe('sandstone.filebrowser.MoveModalInstanceCtrl', function() {
  var FilesystemService;
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_$controller_,_$rootScope_,_FilesystemService_) {
    FilesystemService = _FilesystemService_;
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
  }));

  it('starts with empty filetree data',function() {
    var ctrl;

    ctrl = $controller('MoveModalInstanceCtrl', {
      $scope:$scope,
      FilesystemService: FilesystemService,
      $modalInstance: {},
      file: {}
    });
  });

  it('updates selected file attributes from filtree selection',function() {});

  it('correctly validates filepath',function() {});

  it('sends valid filepath on move',function() {});

});
