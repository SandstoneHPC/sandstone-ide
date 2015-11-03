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

  describe('Editor Functions', function() {
    beforeEach(function() {
      browser.get('/');
      var editor = element(by.css('textarea.ace_text-input'));
      browser.actions().doubleClick($('#aceplace')).perform();
      editor.sendKeys('test.');
      browser.sleep(3000);
    });

    // it('should be marked unsaved after edit', function() {
    //   element.all(by.css('#editor-nav-tabs li.ng-isolate-scope tab-heading > span')).then(function(arr) {
    //     // Force a digest cycle.
    //     browser.actions().mouseMove(element(by.css('#editor-nav-tabs li.ng-isolate-scope tab-heading'))).perform();
    //     expect(arr[2].getAttribute('class')).toContain('fa-circle-o');
    //   });
    // });

    it('should have the entered text', function() {
      element(by.css('div.ace_content')).getText().then(function(text) {
        expect(text.slice(0,-1)).toBe('test.');
      });
    });

    it("should be able to save a file", function(){
      // Click on Save As
      var driver = browser.driver;
      driver.findElements(by.css('span > .dropdown-menu > li > a')).then(function(elements){
        driver.executeScript("arguments[0].click()", elements[8]).then(function(){
          // Expect a modal to show up with title as Save File As
          expect($('.modal-title').getText()).toBe('Save File As');
        });
      });
    });

    it("should prompt to save unsaved file", function(){
      // Click on Close File
      var driver = browser.driver;
      driver.findElements(by.css('span > .dropdown-menu > li > a')).then(function(elements){
        driver.executeScript("arguments[0].click()", elements[9]).then(function(){
          // Expect a modal to show up with title as File Not Saved
          expect($('.modal-title').getText()).toBe('File Not Saved');
        });
      });
    });

    it("should go to terminal and on returning, it should have the same text", function(){
      // Save Text
      var initialText = '';
      $('div.ace_content').getText().then(function(text){
        initialText = text;
        // Go to terminal
        var driver = browser.driver;
        driver.findElements(by.css('ul.navbar-nav > li > a')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[1]).then(function(){
            // Go to editor
            driver.executeScript("arguments[0].click()", elements[0]).then(function(){
              //Get Text
              $('div.ace_content').getText().then(function(text){
                // Expect the text to be the same
                expect(text).toBe(initialText);
              });
            });
          });
        });
      });
    });

    it("should be able to create a new tab and be able to switch between them", function(){
      // Create a new tab
      var initialTabCount = 0;
      var finalTabCount = 0;
      var driver = browser.driver;
      driver.findElements(by.css('ul.nav-tabs > li > a')).then(function(elements){
        initialTabCount = elements.length - 1;
        driver.executeScript("arguments[0].click()", elements[1]).then(function(){
          // Get new tab count
          $$('ul.nav-tabs > li > a').then(function(elements){
            // Final Tab Count should be element length - 1 to leave out the 'plus' element
            finalTabCount = elements.length - 1;
            // expect finalTabCount to be 1 more than initial tab count
            expect(finalTabCount).toBe(initialTabCount + 1);
          });
        });
      });
    });

  });
});
