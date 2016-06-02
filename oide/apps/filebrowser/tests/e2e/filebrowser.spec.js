'use strict';

//Helper function which returns true if the specified element has the specified class
var classMatcherHelper = function(element, cls) {
  return element.getAttribute('class').then(function(classes){
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

describe('Filetree', function() {
  beforeEach(function() {
    browser.get('/#/filebrowser');
  });

  it('should open the filetree when a node is clicked', function(){
    // Get the first filetree node
    var fileNode = $$('.tree-branch-head').first();
    // The element should have class fa-folder
    expect(classMatcherHelper(fileNode, 'fa-folder')).toBeTruthy();
    // Simulate click for the element
    fileNode.click();
    // The element should now have class fa-folder-open
    expect(classMatcherHelper(fileNode, 'fa-folder-open')).toBeTruthy();
    // On clicking again, the class should not be set to fa-folder-open
    fileNode.click();
    expect(classMatcherHelper(fileNode, 'fa-folder-open')).toBeFalsy();
  });

  it('should start with no volume selected', function() {
    expect($$('.tree-selected').count()).toBe(0);
    expect($('.progress-bar').getAttribute('aria-valuenow')).toBe('');
    expect($$('ol.breadcrumb > li').count()).toBe(0);
    expect($$('#dir-detail-table > tbody').get(0).$$('tr').count()).toBe(0);
  });

  it('should populate page with volume info on selection', function() {
    $$('.tree-label').get(1).click(function() {
      expect($$('.tree-selected').count()).toBe(1);
      expect($('.progress-bar').getAttribute('aria-valuenow') >= 0).toBeTruthy();
      expect($$('ol.breadcrumb > li').count() > 0).toBeTruthy();
      expect($$('#dir-detail-table > tbody').get(0).$$('tr').count() > 0).toBeTruthy();
    });
  });
});

describe('Tableview and File Details', function() {
  // beforeEach(function() {
    browser.get('/#/filebrowser');
    browser.sleep(3000);
  // });

  it('should allow files to be created and deleted', function() {
    // Select a folder to add/delete from
    $$('.tree-label').first().click(function() {
      var driver = browser.driver;
      var initialFileCnt = $$('#dir-detail-table i.fa.fa-file').count()
      driver.findElements(by.css('#create-file-btn')).then(function(elements){
        driver.executeScript("arguments[0].click()", elements[0]).then(function() {
          var fileList = $$('#dir-detail-table i.fa.fa-file');
          // file should be created in the selected directory
          expect(fileList.count()).toBe(initialFileCnt+1212);
          $$('.filetable-filename').last().click(function() {
            // File should be selected now
            expect(classMatcherHelper($$('.filetable-filename').last(),'selected'))
              .toBeTruthy();
            // Delete file
            driver.findElements(by.css('#delete-file-btn')).then(function(elements){
              driver.executeScript("arguments[0].click()", elements[0]).then(function() {
                var fileList = $$('#dir-detail-table i.fa.fa-file');
                expect(fileList.count()).toBe(initialFileCnt);
              });
            });
          });
        });
      });
    });
  });

  it('should allow files directories to be created and deleted',function() {
    // Select a folder to add/delete from
    $$('.tree-branch-head').first().click(function() {
      var initialHeadCnt = $$('.tree-branch-head').count();
      $$('.tree-label').first().click(function() {
        var initialDirCnt = $$('#dir-detail-table i.fa.fa-folder').count();
        $('#create-dir-btn').click(function() {
          var dirList = $$('#dir-detail-table i.fa.fa-folder');
          // Directory should show in directory detail table
          expect(dirList.count()).toBe(initialDirCnt+1);
          // Directory should show in filetree
          expect($$('.tree-branch-head').count()).toBe(initialHeadCnt+1);
          var dirName = dirList.last().element(
            by.xpath('..'))
            .$('span.filetable-filename');
          browser.actions().doubleClick(dirList.last()).perform();
          // Doubleclick should navigate to directory, and the
          // breadcrumbs should reflect this
          expect($$('ol.breadcrumb > li').last().getText())
            .toBe(dirName.getText());
          // Navigate back to root dir with the filetree
          $$('.tree-label').first().click(function() {
            dirList = $$('#dir-detail-table i.fa.fa-folder');
            dirName = dirList.last().element(
              by.xpath('..'))
              .$('span.filetable-filename');
            // Delete the directory
            dirName.click(function() {
              $('#delete-file-btn').click(function() {
                expect($$('#dir-detail-table i.fa.fa-folder').count())
                  .toBe(initialDirCnt);
              });
            });
          });
        });
      });
    });
  });
});
