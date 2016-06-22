describe('Sandstone IDE Filetree', function(){

  //Helper function which returns true if the specified element has the specified class
  var classMatcherHelper = function(element, cls) {
    return element.getAttribute('class').then(function(classes){
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  // Run tests for filetree

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


  it('should open the delete modal when delete is clicked', function(){
    $$('.tree-label').first().click().then(function(){
      $$('.filetree-btn').get(2).click(function() {
        var modalTitle = $('h3.modal-title');
        browser.wait(function() {
          return modalTitle.isDisplayed();
        }, 500);
        expect(modalTitle.getText()).toBe('Confirm Remove');
        $('.btn-danger').click();
      });
    });
  });

  it('should open the rename modal when rename is clicked', function(){
      $$('.tree-label').first().click().then(function(){
        $$('.tree-label').first().click();
        //click on rename
        var driver = browser.driver;
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[4]).then(function() {
            //Expect modal to be displayed
            expect($('.modal').isDisplayed()).toBeTruthy();
            // Modal title should be Rename File
            expect($('.modal-title').getInnerHtml()).toBe('Rename File');
            $('.btn-danger').click();
          });
        });
      });
  });

  it('should open a file for editing', function(){
    var driver = browser.driver;
    var initialNumberOfFiles = 0;
    var newNumberOfFiles = 0;
    var fileNode = $$('.tree-branch-head').first().click(function() {
      // Make sure a file exists in the selected directory
      $$('.tree-label').first().click().then(function(){
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[0]).then(function() {
            //Save the initial number of open files
            $$('tab-heading > span.ng-binding').then(function(elements){
              initialNumberOfFiles = elements.length;
              //Open a file
              $('li.tree-leaf > div').click(function(){
                //Click on edit file
                $$('.filetree-btn').get(0).click(function() {
                  $('.filetree-btn').click(function() {
                    expect($$('tab-heading > span.ng-binding').count()).toBe(initialNumberOfFiles+1);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it('should create new file when new file is clicked', function(){
    var driver = browser.driver;
    var initialNumberOfFiles = 0;
    var finalNumberOfFiles = 0;
    $$('.tree-branch-head').first().click(function() {
      $$('.tree-label').first().click().then(function(){
        //Get initial number of files
        $$('.fa-file').then(function(files){
          initialNumberOfFiles = files.length;
          //click on new file
          driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
            driver.executeScript("arguments[0].click()", elements[0]).then(function() {
              expect($$('.fa-file').count()).toBe(initialNumberOfFiles + 1);
            });
          });
        });
      });
    });
  });

  it('should be able to duplicate a file', function(){
    // var fileNode = element.all(by.css('.tree-branch-head')).first();
    // fileNode.click();
    var driver = browser.driver;
    var initialNumberOfFiles = 0;
    var newNumberOfFiles = 0;
    //Save the initial number of open files

    var fileNode = $$('.tree-branch-head').first().click(function() {
      // Make sure a file exists in the selected directory
      $$('.tree-label').first().click().then(function(){
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[0]).then(function() {
            $$('li.tree-leaf > div').then(function(elements){
              initialNumberOfFiles = elements.length;
              $('li.tree-leaf > div').click().then(function(){
                //Click on duplicate file
                $$('.filetree-btn').get(1).click(function() {
                  expect($$('li.tree-leaf > div').count()).toBe(initialNumberOfFiles + 1);
                });
              });
            });
          });
        });
      });
    });
  });

  it('should create a new folder', function(){
    var driver = browser.driver;
    var initialNumberOfFolders = 0;
    var finalNumberOfFolders = 0;
    $$('.tree-branch-head').first().click(function() {
      $$('.tree-label').first().click().then(function(){
        //Get initial number of folders
        $$('.fa-file').then(function(folders){
          initialNumberOfFolders = files.length;
          //click on new folder
          driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
            driver.executeScript("arguments[0].click()", elements[1]).then(function() {
              expect($$('.fa-folder').count()).toBe(initialNumberOfFolders + 1);
            });
          });
        });
      });
    });
  });

  it('should copy a file to clipboard and paste in a folder', function(){
    // var fileNode = element.all(by.css('.tree-branch-head')).first();
    // fileNode.click();
    var initialNumberOfFiles = 0;
    var newNumberOfFiles = 0;
    var driver = browser.driver;
    // Make sure a file exists in the selected directory
    $$('.tree-branch-head').first().click(function() {
      $$('.tree-label').first().click().then(function(){
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[0]).then(function() {
            $$('.tree-label').then(function(elements){
              // Count the number of files
              initialNumberOfFiles = elements.length;
              //Click on first element
              elements[1].click().then(function(){
                // click on copy
                driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
                  driver.executeScript("arguments[0].click()", elements[2]).then(function(){
                    // Click paste
                    driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
                      driver.executeScript("arguments[0].click()", elements[3]).then(function(){
                        // count elements
                        // Expect new number of files to be one more than initial number of files
                        expect($$('.tree-label').count()).toBe(initialNumberOfFiles+1);
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
});
