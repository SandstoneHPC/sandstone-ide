'use strict';

describe('sandstone.filebrowser.fbFileDetails', function() {
  var baseElement = '<div fb-file-details></div>';

  var volumeDetails, fsDetails, fileDetails, dirDetails;

  var FilesystemService;
  var FilebrowserService;
  var AlertService;
  var mockResolve, mockReject;
  var $rootScope, digest, $q;

  beforeEach(module('sandstone'));
  beforeEach(module('sandstone.templates'));
  beforeEach(module('sandstone.broadcastservice'));
  beforeEach(module('sandstone.filesystemservice'));
  beforeEach(module('sandstone.filebrowser'));

  beforeEach(function() {
    volumeDetails = {
      available: '11G',
      filepath: '/volume1/',
      size: '18G',
      type: 'volume',
      used: '6.0G',
      used_pct: 36
    };
    fsDetails = {
      groups: ['testgrp'],
      type: 'filesystem',
      volumes: [volumeDetails]
    };
    fileDetails = {
      type: 'file',
      filepath: '/volume1/file1',
      dirpath: '/volume1',
      name: 'file1',
      owner: 'testuser',
      group: 'testgrp',
      permissions: 'rwxrw-r--',
      size: '8.8K'
    };
    dirDetails = {
      type: 'directory',
      filepath: '/volume1',
      dirpath: '/volume1/',
      name: 'volume1',
      owner: 'testuser',
      group: 'testgrp',
      permissions: 'rwxrw-r--',
      size: '4.0K',
      contents: [fileDetails]
    };
  });

  beforeEach(inject(function(_FilesystemService_,_$q_) {
    $q = _$q_;

    FilesystemService = _FilesystemService_;
    // FilebrowserService automatically calls FS service methods
    var deferredGetFsDetails = $q.defer();
    deferredGetFsDetails.resolve(fsDetails);
    spyOn(FilesystemService,'getFilesystemDetails').and.returnValue(deferredGetFsDetails.promise);
  }));

  beforeEach(inject(function(_FilebrowserService_,_AlertService_,_$rootScope_) {
    FilebrowserService = _FilebrowserService_;
    AlertService = _AlertService_;
    $rootScope = _$rootScope_;

    digest = function() {
      $rootScope.$digest();
    };
  }));

  describe('controller', function() {
    var $compile, $scope, isolateScope, element;

    beforeEach(inject(function(_$compile_) {
      $compile = _$compile_;
      $scope = $rootScope.$new();

      element = $compile(baseElement)($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }));

    it('gets filesystem details on load',function() {
      spyOn(FilebrowserService,'getFilesystem').and.returnValue(fsDetails);
      element = $compile(baseElement)($scope);
      $scope.$digest();
      expect(FilebrowserService.getFilesystem).toHaveBeenCalled();
    });

    it('watches for selection changes and deep copies file',function() {
      // File is selected
      var selection = {selectedFile: fileDetails};
      spyOn(FilebrowserService,'getSelection').and.returnValue(selection);
      $scope.$digest();
      expect(isolateScope.selection).toBe(selection);
      expect(isolateScope.editFile).not.toBe(fileDetails);
      expect(isolateScope.editFile.filepath).toEqual(fileDetails.filepath);
      // Selected file is undefined
      selection = {selectedFile: undefined};
      FilebrowserService.getSelection = jasmine.createSpy().and.returnValue(selection);
      $scope.$digest();
      expect(isolateScope.selection).toBe(selection);
      expect(isolateScope.editFile).toEqual({});
    });

    it('edit file contains a model for permissions edits',function() {
      var selection = {selectedFile: fileDetails};
      var permModel = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: false,
        6: true,
        7: false,
        8: false
      }
      spyOn(FilebrowserService,'getSelection').and.returnValue(selection);
      $scope.$digest();
      expect(isolateScope.editFile.permModel).toEqual(permModel);
    });

    it('editing filename renames the file',function() {
      var filepath = '/file/path';
      var filename = 'filename';
      var newpath = '/volume1/file1';

      var deferredRename = $q.defer();
      deferredRename.resolve(newpath);
      spyOn(FilesystemService,'rename').and.returnValue(deferredRename.promise);
      var deferredGetFileDetails = $q.defer();
      deferredGetFileDetails.resolve(fileDetails);
      spyOn(FilesystemService,'getFileDetails').and.returnValue(deferredGetFileDetails.promise);
      spyOn(FilebrowserService,'setSelectedFile').and.callThrough();

      isolateScope.editFile = {name: filename};
      isolateScope.selection = {selectedFile: {filepath: filepath}};
      isolateScope.renameFile();
      $scope.$digest();

      expect(FilesystemService.rename.calls.argsFor(0)).toEqual([filepath,filename]);
      expect(FilebrowserService.setSelectedFile.calls.argsFor(0)).toEqual([fileDetails]);
    });

    it('rename error shows alert and resets filename',function() {
      var filepath = '/file/path';
      var filename = 'filename';
      var originalFilename = 'orig-filename';
      var newpath = '/volume1/file1';

      var deferredRename = $q.defer();
      deferredRename.reject({},500);
      spyOn(FilesystemService,'rename').and.returnValue(deferredRename.promise);
      spyOn(AlertService,'addAlert').and.returnValue('uuid-4444');

      isolateScope.editFile = {name: filename};
      isolateScope.selection = {
        selectedFile: {
          filepath: filepath,
          name: originalFilename
        }
      };
      isolateScope.renameFile();
      $scope.$digest();

      expect(AlertService.addAlert.calls.count()).toEqual(1);
      expect(isolateScope.editFile.name).toEqual(originalFilename);
    });

    it('selecting a new group changes the group',function() {
      var filepath = '/volume1/file1';
      var group = 'testgrp2';
      FilebrowserService.setSelectedFile(fileDetails);
      $scope.$digest();

      var deferredChangeGroup = $q.defer();
      deferredChangeGroup.resolve();
      spyOn(FilesystemService,'changeGroup').and.returnValue(deferredChangeGroup.promise);

      isolateScope.editFile = {group: group};
      isolateScope.changeGroup();
      $scope.$digest();

      expect(FilesystemService.changeGroup.calls.argsFor(0)).toEqual([filepath,group]);
      expect(isolateScope.selection.selectedFile.group).toEqual(group);
    });

    it('group change error shows alert and resets group',function() {
      var filepath = '/volume1/file1';
      var originalGroup = fileDetails.group;
      var group = 'testgrp2';
      FilebrowserService.setSelectedFile(fileDetails);
      $scope.$digest();

      var deferredChangeGroup = $q.defer();
      deferredChangeGroup.reject({},500);
      spyOn(FilesystemService,'changeGroup').and.returnValue(deferredChangeGroup.promise);
      spyOn(AlertService,'addAlert').and.returnValue('uuid-4444');

      isolateScope.editFile = {group: group};
      isolateScope.changeGroup();
      $scope.$digest();

      expect(AlertService.addAlert.calls.count()).toEqual(1);
      expect(isolateScope.editFile.group).toEqual(originalGroup);
    });

    it('editing permissions model changes permissions',function() {});

    it('opening in editor sends signal and changes location',function() {});

    it('duplicates created with proper suffix',function() {});

    it('file moved to location specified by move modal',function() {});

    it('file is deleted and selection is cleared',function() {});

  });

  describe('directive', function() {
    var $compile, $scope, isolateScope, element;

    var getMatchesFromTpl = function(pattern,tpl) {
      var matches = tpl.match(pattern);
      if (!matches) {
        return [];
      }
      return matches;
    };

    var renderTpl = function(scope,el) {
      var tpl;
      scope.$digest();
      tpl = el.html();
      return tpl;
    };

    beforeEach(inject(function(_$compile_) {
      $compile = _$compile_;
      $scope = $rootScope.$new();

      element = $compile(baseElement)($scope);
      $scope.$digest();
      isolateScope = element.isolateScope();
    }));

    it('changes to edit propagate to template',function() {});

    it('group select is populated',function() {});

    it('permissions matrix renders properly',function() {});

  });

});
