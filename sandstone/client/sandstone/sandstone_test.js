'use strict';

describe('sandstone module', function() {
  beforeEach(module('sandstone'));

  describe('sandstone.PageService', function() {
    it('should return /#/editor as the current location.', inject(function(PageService,$location) {
      $location.path('/terminal');
      expect(PageService.getCurrentUrl()).toBe('/#/terminal');
    }));
  });

  describe('sandstone.PageCtrl', function() {
    var $controller;

    beforeEach(inject(function(_$controller_) {
      $controller = _$controller_;
    }));

    it('returns /editor as the current URL.', inject(function($location,PageService) {
      var ctrl = $controller('PageCtrl',{});
      $location.path('/editor');
      expect(ctrl.currentUrl()).toBe('/#/editor');
    }));
  });
});
