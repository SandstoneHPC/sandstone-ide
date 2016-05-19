'use strict';

var sendKeys = function() {
  var editor = $('textarea.ace_text-input');
  browser.actions().doubleClick($('#aceplace')).perform();
  editor.sendKeys('test.');
};

describe('OIDE Ace Editor', function() {
  browser.get('/');

  it('should load an ace instance with the page', function() {
    expect($('#aceplace > textarea').isPresent()).toBe(true);
  });

  it('contents should be empty', function() {
    $$('.ace_line').then(function(arr) {
      expect(arr.length).toEqual(1);
    });
  });
});

describe('OIDE Editor Tabs', function() {
  browser.get('/');

  it('should initialize with one document', function() {
    $$('#editor-nav-tabs li.ng-isolate-scope').then(function(arr) {
      expect(arr.length).toBe(2);
      expect(arr[1].getAttribute('tooltip')).toBe('Create New Document');
    });
  });

  it('initial document should be -/Untitled0', function() {
    var el = $$('#editor-nav-tabs li.ng-isolate-scope tab-heading > span').get(0);
    expect(el.getText()).toBe('UNTITLED0');
    expect(el.getAttribute('tooltip')).toBe('-/untitled0');
  });

  it('should have a functioning dropdown menu', function() {
    $$('#editor-nav-tabs li.ng-isolate-scope tab-heading > span').then(function(arr) {
      arr[1].click();
      $$('#editor-nav-tabs span.fa-caret-down > ul.dropdown-menu > li').then(function(arr) {
        expect(arr.length).toBe(8);
      });
    });
  });

  it('should not be marked as unsaved', function() {
    $$('#editor-nav-tabs li.ng-isolate-scope tab-heading > span').then(function(arr) {
      expect(arr[2].getAttribute('class')).toContain('fa-times');
    });
  });

  describe('Editor Functions', function() {
    beforeEach(function() {
      browser.get('/');
      sendKeys();
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
      $('div.ace_content').getText().then(function(text) {
        expect(text.slice(0,-1)).toBe('test.');
      });
    });

    it("should be able to save a file", function(){
      // Click on Save File As
      $('span.dropdown-toggle').click();
      $$('span > .dropdown-menu > li > a').get(5).click();
      var modalTitle = $('h3.modal-title');
      browser.wait(function() {
        return modalTitle.isDisplayed();
      }, 500);
      // Expect a modal to show up with title Save File As
      expect(modalTitle.getText()).toBe('Save File As');
    });

    it("should prompt to save unsaved file", function(){
      // Click on Close File
      $('span.dropdown-toggle').click();
      $$('span > .dropdown-menu > li > a').get(6).click();
      var modalTitle = $('h3.modal-title');
      browser.wait(function() {
        return modalTitle.isDisplayed();
      }, 500);
      // Expect a modal to show up with title File Not Saved
      expect(modalTitle.getText()).toBe('File Not Saved');
    });

    it("should go to filebrowser and on returning, it should have the same text", function(){
      // Save Text
      var initialText = '';
      $('div.ace_content').getText().then(function(text){
        initialText = text;
        // Wait for filebrowser app to load
        $$('ul.nav > li > a').get(1).click();
        browser.wait(function() {
          return $('div.progress').isDisplayed();
        }, 500);
        // Wait for editor app to load
        $$('ul.nav > li > a').get(0).click();
        browser.wait(function() {
          return $('#editor-nav-tabs').isDisplayed();
        }, 500);
        expect($('div.ace_content').getText()).toBe(initialText);
      });
    });

    it("should be able to create a new tab and be able to switch between them", function(){
      // Create a new tab
      var initialTabCount = 0;
      var finalTabCount = 0;
      var driver = browser.driver;

      // Save value of editor
      var tab_1_text = "";
      element(by.css('div.ace_content')).getText().then(function(text) {
        tab_1_text = text;
      });

      driver.findElements(by.css('ul.nav-tabs > li > a')).then(function(elements){
        initialTabCount = elements.length - 1;
        driver.executeScript("arguments[0].click()", elements[1]).then(function(){
          // Get new tab count
          $$('ul.nav-tabs > li > a').then(function(elements){
            var tabs = elements;
            // Final Tab Count should be element length - 1 to leave out the 'plus' element
            finalTabCount = elements.length - 1;
            // expect finalTabCount to be 1 more than initial tab count
            expect(finalTabCount).toBe(initialTabCount + 1);

            // Send some text to Editor
            sendKeys();

            // Save value of tab 2
            var tab_2_text = "";
            element(by.css('div.ace_content')).getText().then(function(text){
              tab_2_text = text;

              // Switch to Tab 1
              tabs[0].click().then(function(){
                // Get value of ace editor
                element(by.css('div.ace_content')).getText().then(function(text){
                  //Expect text to be equal to tab_1_text
                  expect(text).toBe(tab_1_text);

                  // Switch to Tab 1
                  tabs[1].click().then(function(){
                    // Get value of editor
                    element(by.css('div.ace_content')).getText().then(function(text){
                      // Expect text to be equal to tab_2_text
                      expect(text).toBe(tab_2_text);
                    });
                  });
                });
              });
            });

          });
        });
      });
    });

    it("should be able to find and replace", function(){
      // Click on Find & Replace
      $('span.dropdown-toggle').click();
      $$('span > .dropdown-menu > li > a').get(3).click();
      var searchBox = $('div.ace_search.right');
      browser.wait(function() {
        return searchBox.isDisplayed();
      }, 500);
      // Find
      $('.ace_search_form > .ace_search_field').sendKeys('es');
      $('.ace_searchbtn.next').click();
      var searchRes = $$('.ace_selection');
      expect(searchRes.count()).toBe(1);

      // Replace
      $('.ace_replace_form > .ace_search_field').sendKeys('el');
      // Replace all
      $$('.ace_replacebtn').get(1).click(function() {
        // Grab Ace text
        expect($('div.ace_content').getText().slice(0,-1)).toBe('telt.');
      });
    });

    it("should be able to undo and redo changes", function(){
      // Save the value of editor text
      var initialText = "";
      var finalText = "";
      var driver = browser.driver;
      element(by.css('div.ace_content')).getText().then(function(text){
        initialText = text;
        // console.log(initialText);
        // Send some more text
        sendKeys("Hello World");

        browser.sleep(2000).then(function(){
          // Get new text
          element(by.css('div.ace_content')).getText().then(function(text){
            finalText = text;

            // Click on Undo
            driver.findElements(by.css('span > .dropdown-menu > li > a')).then(function(elements){
              driver.executeScript("arguments[0].click()", elements[0]).then(function(){
                // Get the Text
                // browser.pause();
                element(by.css('div.ace_content')).getText().then(function(text){
                  // Expect text to be equal to initialText
                  expect(text.slice(0, -1)).toBe("");

                  // Click on Redo
                  driver.executeScript("arguments[0].click()", elements[1]).then(function(){
                    element(by.css('div.ace_content')).getText().then(function(text){
                      // Expect text to be equal to finalText
                      expect(text).toBe(finalText);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  });
});
