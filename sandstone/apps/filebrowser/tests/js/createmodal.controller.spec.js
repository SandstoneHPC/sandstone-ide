'use strict';

describe('sandstone.filebrowser.CreateModalInstanceCtrl', function() {
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_$rootScope_,_$controller_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
  }));

  it('sets type based on action',function() {
    var ctrl;

    ctrl = $controller('CreateModalInstanceCtrl', {
      $scope:$scope,
      $modalInstance: {},
      action: {}
    });
  });

  it('sets baseDirectory from action',function() {});

  it('sets new file name to Untitled if none specified',function() {});

});
