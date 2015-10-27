'use strict';

describe('OIDE Ace Editor', function() {
  browser.get('/');
  
  it('should load an ace instance with the page', function() {
    expect(element(by.css('#aceplace > textarea')).isPresent()).toBe(true);
  });
  
  it('contents should be empty', function() {
    element.all(by.css('.ace_line')).then(function(arr) {
      expect(arr.length).toEqual(1);
    });
  });
});

describe('OIDE Editor Tabs', function() {
  browser.get('/');
  
  it('should initialize with one document', function() {
    element.all(by.css('#editor-nav-tabs li.ng-isolate-scope')).then(function(arr) {
      expect(arr.length).toBe(2);
      expect(arr[1].getAttribute('tooltip')).toBe('Create New Document');
    });
  });
  
  it('initial document should be -/Untitled0', function() {
    var el = element(by.css('#editor-nav-tabs li.ng-isolate-scope tab-heading > span'));
    expect(el.getText()).toBe('UNTITLED0');
    expect(el.getAttribute('tooltip')).toBe('-/untitled0');
  });
  
  it('should have a functioning dropdown menu', function() {
    element.all(by.css('#editor-nav-tabs li.ng-isolate-scope tab-heading > span')).then(function(arr) {
      arr[1].click();
      element.all(by.css('#editor-nav-tabs span.fa-caret-down > ul.dropdown-menu > li')).then(function(arr) {
        expect(arr.length).toBe(11);
      });
    });
  });
  
  it('should not be marked as unsaved', function() {
    element.all(by.css('#editor-nav-tabs li.ng-isolate-scope tab-heading > span')).then(function(arr) {
      expect(arr[2].getAttribute('class')).toContain('fa-times');
    });
  });
});
