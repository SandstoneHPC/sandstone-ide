'use strict';

describe('oide module', function() {
  beforeEach(module('oide'));
  
  describe('oide.PageService', function() {
    it('should return /#/editor as the current location.', inject(function(PageService,$location) {
      $location.path('/terminal');
      expect(PageService.getCurrentUrl()).toBe('/#/terminal');
    }));
  });
  
  describe('oide.PageCtrl', function() {
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
