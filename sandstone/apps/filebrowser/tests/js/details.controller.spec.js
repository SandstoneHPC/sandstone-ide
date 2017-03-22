'use strict';

describe('sandstone.filebrowser.DetailsCtrl', function() {
  var FilebrowserService;
  var ctrl;
  var $controller;
  var $scope;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(inject(function(_FilebrowserService_,_$rootScope_,_$controller_) {
    FilebrowserService = _FilebrowserService_;
    $controller = _$controller_;

    $scope = _$rootScope_.$new();
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

    it('creates a new file selects it',function() {});

    it('creates a new directory and selects it',function() {});

  });

});
