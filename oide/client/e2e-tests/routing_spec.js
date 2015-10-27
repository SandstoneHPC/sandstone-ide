'use strict';

describe('OIDE routing', function() {
  // browser.pause();
  browser.get('/');

  it('should automatically redirect to /editor after login', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/editor");
  });

  it('should automatically redirect to /editor when invalid location specified', function() {
    browser.get('#/invalid/location');
    expect(browser.getLocationAbsUrl()).toMatch("/editor");
  });
});
