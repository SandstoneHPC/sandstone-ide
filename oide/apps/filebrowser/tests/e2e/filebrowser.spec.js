describe('OIDE Filebrowser', function() {
  beforeEach(function() {
    browser.get('/#/filebrowser');
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
