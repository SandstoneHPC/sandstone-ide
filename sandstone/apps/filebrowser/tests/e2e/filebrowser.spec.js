'use strict';

//Helper function which returns true if the specified element has the specified class
var classMatcherHelper = function(element, cls) {
  return element.getAttribute('class').then(function(classes){
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

var FilebrowserPage = function() {
  var progressBar = element(by.css('.progress-bar'));
  var breadcrumbs = element.all(by.css('ol.breadcrumb > li'));
  var dirDetails = element.all(by.css('#dir-detail-table > tbody'));
  var files = element.all(by.css('.filetable-filename'));

  this.get = function() {
    browser.get('/#/filebrowser');
    // browser.waitForAngular();
  };
  this.getVolumeUsage = function() {
    return progressBar.getAttribute('aria-valuenow');
  };
  this.breadcrumbs = function() {
    return breadcrumbs;
  };
  this.dirDetails = function() {
    return dirDetails.get(0);
  };
  this.files = function() {
    return files;
  };
};

var Filetree = function() {
  var dirIcons = element.all(by.css('.tree-branch-head'));
  var dirLabels = element.all(by.css('.tree-label'));
  var selectedDirs = element.all(by.css('.tree-selected'));

  this.dirIcons = function() {
    return dirIcons;
  };
  this.dirLabels = function() {
    return dirLabels;
  };
  this.selectedDirs = function() {
    return selectedDirs;
  };
  this.selectFirstDir = function() {
    dirLabels.first().click();
  },
  this.expandFirstDir = function() {
    dirIcons.first().click();
  };
  this.expandDir = function(index) {
    dirIcons.get(index).click();
  };
  this.selectDir = function(index) {
    dirLabels.get(index).click();
  };
};

describe('Filebrowser', function() {
  var page, filetree;

  beforeEach(function() {
    page = new FilebrowserPage();
    filetree = new Filetree();
    page.get();
  });

  it('should open the filetree when a node is clicked', function(){
    // The first element should have class fa-folder
    expect(classMatcherHelper(filetree.dirIcons().first(),'fa-folder'))
      .toBeTruthy();
    // Simulate click for the element
    filetree.expandFirstDir();
    // The element should now have class fa-folder-open
    expect(classMatcherHelper(filetree.dirIcons().first(),'fa-folder-open'))
      .toBeTruthy();
    // On clicking again, the class should not be set to fa-folder-open
    filetree.expandFirstDir();
    expect(classMatcherHelper(filetree.dirIcons().first(),'fa-folder-open'))
      .toBeFalsy();
  });

  it('should start with no volume selected', function() {
    expect(filetree.selectedDirs().count()).toBe(0);
    expect(page.getVolumeUsage()).toBe('');
    expect(page.breadcrumbs().count()).toBe(0);
    expect(page.dirDetails().$$('tr').count()).toBe(0);
  });

  it('should populate page with volume info on selection', function() {
    filetree.dirLabels().first().click(function() {
      expect(filetree.selectedDirs().count()).toBe(1);
      expect(page.getVolumeUsage() >= 0).toBeTruthy();
      expect(page.breadcrumbs().count() > 0).toBeTruthy();
      expect(page.dirDetails().$$('tr').count() > 0).toBeTruthy();
    });
  });

  it('should allow files to be created and deleted', function() {
    // Select a folder to add/delete from
    filetree.dirLabels().last().click(function() {
      driver.findElements(by.css('#create-file-btn')).then(function(elements){
        driver.executeScript("arguments[0].click()", elements[0]).then(function() {
          // file should be created in the selected directory
          expect(page.files().count()).toBe(13);
          $$('.filetable-filename').last().click(function() {
            // File should be selected now
            expect(classMatcherHelper($$('.filetable-filename').last(),'selected'))
              .toBeTruthy();
            // Delete file
            driver.findElements(by.css('#delete-file-btn')).then(function(elements){
              driver.executeScript("arguments[0].click()", elements[0]).then(function() {
                expect(fileList.count()).toBe(13);
              });
            });
          });
        });
      });
    });
  });
});
