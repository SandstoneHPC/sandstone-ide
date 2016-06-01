describe('OIDE Filebrowser', function() {
  //Helper function which returns true if the specified element has the specified class
  var classMatcherHelper = function(element, cls) {
    return element.getAttribute('class').then(function(classes){
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  beforeEach(function() {
    browser.get('/#/filebrowser');
  });

  describe('Filetree', function() {
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
      expect($$('table.table > tbody').get(0).$$('tr').count()).toBe(0);
    });

    it('should populate page with volume info on selection', function() {
      $$('.tree-label').get(1).click(function() {
        expect($$('.tree-selected').count()).toBe(1);
        expect($('.progress-bar').getAttribute('aria-valuenow') >= 0).toBeTruthy();
        expect($$('ol.breadcrumb > li').count() > 0).toBeTruthy();
        expect($$('table.table > tbody').get(0).$$('tr').count() > 0).toBeTruthy();
      });
    });
  });
});
