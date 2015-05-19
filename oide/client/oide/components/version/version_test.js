'use strict';

describe('oide.version module', function() {
  beforeEach(module('oide.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
