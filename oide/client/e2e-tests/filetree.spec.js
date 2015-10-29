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

  it('should open the rename modal when rename is clicked', function(){
      $('.tree-label').click().then(function(){
        $('.dropdown-toggle').click().then(function(){
          //click on rename
          $$('.fc-dropdown-link').get(4).click();
          //Expect modal to be displayed
          expect($('.modal').isDisplayed()).toBeTruthy();
          // Modal title should be Rename File
          expect($('.modal-title').getInnerHtml()).toBe('Rename File');
          // browser.pause();
          $('.btn-danger').click();
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
      });
      console.log(initialNumberOfFiles);
      //Open a file
      $('li.tree-leaf > div').click().then(function(){
        //Click on edit file
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
