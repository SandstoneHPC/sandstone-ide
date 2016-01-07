'use strict';

describe('oide.editor.EditorService', function() {
  beforeEach(module('oide'));
  beforeEach(module('oide.editor'));
  
  describe('oide.editor.EditorService settings', function() {
    var aceMock,sessMock;
    
    beforeEach(function() {
      sessMock = jasmine.createSpyObj(
        'sessMock',
        [
          'getUndoManager',
          'setUndoManager',
          'getDocument',
          'setUseSoftTabs',
          'setTabSize'
        ]
      );
      aceMock = jasmine.createSpyObj(
        'aceMock',
        [
          'setSession',
          'setShowInvisibles',
          'setFontSize',
          'setDisplayIndentGuides'
        ]
      );
      aceMock.getSession = function() {
        return sessMock;
      };
    });
    
    it('starts with the correct defaults.', inject(function(EditorService) {
      var defaults = {
        showInvisibles: true,
        useSoftTabs: true,
        fontSize: 12,
        tabSize: 4,
        showIndentGuides: true
      };
      expect(EditorService.getSettings()).toEqual(defaults);
    }));
    it('correctly modifies settings.', inject(function(EditorService) {
      EditorService.onAceLoad(aceMock);
      var newSettings = {
        showInvisibles: false,
        useSoftTabs: false,
        fontSize: 14,
        tabSize: 2,
        showIndentGuides: false
      };
      EditorService.setSettings(newSettings);
      expect(EditorService.getSettings()).toEqual(newSettings);
      expect(sessMock.setUseSoftTabs).toHaveBeenCalledWith(false);
      expect(sessMock.setTabSize).toHaveBeenCalledWith(2);
      expect(aceMock.setShowInvisibles).toHaveBeenCalledWith(false);
      expect(aceMock.setFontSize).toHaveBeenCalledWith(14);
    }));
  });
});
