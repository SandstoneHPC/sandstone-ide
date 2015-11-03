describe('OIDE Filetree', function(){

  //Helper function which returns true if the specified element has the specified class
  var classMatcherHelper = function(element, cls) {
    return element.getAttribute('class').then(function(classes){
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  // Run tests for filetree

  it('should open the filetree when a node is clicked', function(){
    // Get the first filetree node
    var fileNode = element.all(by.css('.tree-branch-head')).first();
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
      $('.tree-label').click().then(function(){
        var driver = browser.driver;
        driver.findElements(by.css('.filetree-btn')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[2]).then(function() {
            expect($('.modal').isDisplayed()).toBeTruthy();
            // Modal title should be Confirm Remove
            expect($('.modal-title').getText()).toBe('Confirm Remove');
            $('.btn-danger').click();
          });
        });
      });
  });

  it('should open the rename modal when rename is clicked', function(){
      $('.tree-label').click().then(function(){
        $('.tree-label').click();
        //click on rename

        var driver = browser.driver;
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[4]).then(function() {
            //$$('.fc-dropdown-link').get(4).click();
            //Expect modal to be displayed
            // browser.pause();
            expect($('.modal').isDisplayed()).toBeTruthy();
            // Modal title should be Rename File
            expect($('.modal-title').getInnerHtml()).toBe('Rename File');
            // browser.pause();
            $('.btn-danger').click();
          });
        });
      });
  });

  it('should open a file for editing', function(){
      var fileNode = element.all(by.css('.tree-branch-head')).first();
      fileNode.click();

      var initialNumberOfFiles = 0;
      var newNumberOfFiles = 0;
      //Save the initial number of open files
      $$('tab-heading > span.ng-binding').then(function(elements){
        initialNumberOfFiles = elements.length;
        console.log(initialNumberOfFiles);
        //Open a file
        $('li.tree-leaf > div').click().then(function(){
          //Click on edit file
          var driver = browser.driver;
          driver.findElements(by.css('.filetree-btn')).then(function(elements){
            driver.executeScript("arguments[0].click()", elements[0]).then(function() {
              $('.filetree-btn').click().then(function(){
                //Get new number of open files
                $$('tab-heading > span.ng-binding').then(function(elements){
                  newNumberOfFiles = elements.length;
                  //Expect new number of files to be 1 greater than initial number of file
                  expect(newNumberOfFiles).toBe(initialNumberOfFiles + 1);
                });
              });
            });
          });
        });
      });
  });

  it('should create new file when new file is clicked', function(){
    var initialNumberOfFiles = 0;
    var finalNumberOfFiles = 0;
      $('.tree-label').click().then(function(){
        var driver = browser.driver;
        driver.findElements(by.css('.dropdown-toggle')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[0]).then(function() {
            //Get initial number of files
            $$('.fa-file').then(function(files){
              initialNumberOfFiles = files.length;
            });
            //click on new file
            $$('.fc-dropdown-link').get(0).click().then(function(){
              // browser.pause();
              $$('.fa-file').then(function(files){
                finalNumberOfFiles = files.length;
                // expect finalNumberOfFiles to be 1 more than initialNumberOfFiles
                expect(finalNumberOfFiles).toBe(initialNumberOfFiles + 1);
              });
            });
          });
        });
      });
  });

  it('should be able to duplicate a file', function(){
    // var fileNode = element.all(by.css('.tree-branch-head')).first();
    // fileNode.click();

    var initialNumberOfFiles = 0;
    var newNumberOfFiles = 0;
    //Save the initial number of open files

    $$('li.tree-leaf > div').then(function(elements){
      initialNumberOfFiles = elements.length;
      $('li.tree-leaf > div').click().then(function(){
        //Click on duplicate file
        var driver = browser.driver;
        driver.findElements(by.css('.filetree-btn')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[1]).then(function() {
            //Get new number of open files
            $$('li.tree-leaf > div').then(function(elements){
              newNumberOfFiles = elements.length;
              console.log(newNumberOfFiles);
              // browser.pause();
              //Expect new number of files to be 1 greater than initial number of file
              expect(newNumberOfFiles).toBe(initialNumberOfFiles + 1);
            });
          });
        });
      });
    });
  });

  it('should create a new folder', function(){
    var driver = browser.driver;
    var initialNumberofFolders = 0;
    var finalNumberOfFolders = 0;
    $('.tree-label').click().then(function(){
      $$('.fa-folder').then(function(elements){
        initialNumberofFolders = elements.length;
        // Get the number of folders
        driver.findElements(by.css('.fc-dropdown-link')).then(function(elements){
          driver.executeScript("arguments[0].click()", elements[1]).then(function() {
            $$('.fa-folder').then(function(elements){
              finalNumberOfFolders = elements.length;
              // expect finalNumberOfFolders to be 1 more than initialNumberofFolders
              expect(finalNumberOfFolders).toBe(initialNumberofFolders + 1);
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
    // Count the number of files
    $$('.tree-label').then(function(elements){
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
                $$('.tree-label').then(function(elements){
                  newNumberOfFiles = elements.length;
                  // Expect new number of files to be one more than initial number of files
                  expect(newNumberOfFiles).toBe(initialNumberOfFiles + 1);
                });
              });
            });
          });
        });
      });
    });
  });
});
