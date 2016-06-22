'use strict';

var sendKeys = function() {
  var editor = $('textarea.ace_text-input');
  browser.actions().doubleClick($('#aceplace')).perform();
  editor.sendKeys('test.');
};

describe('Sandstone IDE Ace Editor', function() {
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

describe('Sandstone IDE Editor Tabs', function() {
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
      $('.modal-footer > button.btn-success').click();
      var modalTitle = $('h3.modal-title');
      var saveAsModal = $('.modal-body .filetree-container');
      browser.wait(function() {
        return saveAsModal.isDisplayed();
      }, 500);
      expect(modalTitle.getText()).toBe('Save File As');
      $$('.modal-body div.tree-label').then(function(elements) {
        var tmpDir = elements[1];
        var fnameInput = $('#filename-input');
        tmpDir.click();
        fnameInput.click();
        fnameInput.sendKeys('test-');
        browser.executeScript('window.scrollTo(0,10000);');
        $('.modal-footer > button.btn-success').click(function() {
          $$('.filetree-btn').get(3).click(function() {
            $$('div.tree-label').get(1).click(function() {
              var files = $$('div.tree-label div.tree-label:first-child');
              expect(files.get(1).getText()).toBe('test-untitled0');
            });
          });
        });
      });
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
      // Save value of editor
      var tabOneText = '';
      $('div.ace_content').getText().then(function(text) {
        tabOneText = text;
      });
      // Get new tab count
      initialTabCount = $$('ul.nav-tabs > li > a').count() - 1;
      $$('ul.nav-tabs > li > a').get(1).click(function() {
        // Final Tab Count should be element length - 1 to leave out the 'plus' element
        finalTabCount = $$('ul.nav-tabs > li > a').count() - 1;
        // expect finalTabCount to be 1 more than initial tab count
        expect(finalTabCount).toBe(initialTabCount+1);
      });
      // Send some text to Editor
      sendKeys();
      // Save value of tab 2
      var tabTwoText = '';
      $('div.ace_content').getText().then(function(text) {
        tabTwoText = text;
      });
      // Switch to Tab 1
      $$('ul.nav-tabs > li > a').get(0).click(function() {
        $('div.ace_content').getText().then(function(text) {
          //Expect text to be equal to tabOneText
          expect(text).toBe(tabOneText);
        });
      });
      // Switch to Tab 2
      $$('ul.nav-tabs > li > a').get(1).click(function() {
        $('div.ace_content').getText().then(function(text) {
          //Expect text to be equal to tabTwoText
          expect(text).toBe(tabTwoText);
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

      $('div.ace_content').getText().then(function(text) {
        initialText = text;
        // Send some more text
        $('textarea.ace_text-input').sendKeys('Hello World').then(function() {
          $('div.ace_content').getText().then(function(text) {
            finalText = text;
          });
        });
      });
      // Click on Undo
      $('span.dropdown-toggle').click();
      $$('span > .dropdown-menu > li > a').get(0).click(function() {
        expect($('div.ace_content').getText().slice(0,-1)).toBe(initialText);
      });
      // Click on Redo
      $('span.dropdown-toggle').click();
      $$('span > .dropdown-menu > li > a').get(1).click(function() {
        expect($('div.ace_content').getText().slice(0,-1)).toBe(finalText);
      });
    });

  });
});
