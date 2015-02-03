var EditorManager = {
  editor: ace.edit('editor'),
  sessions: {},
  numTabs: 1,
  currentWorkingDocument: '#editortab-1',
  clipboard: '',
  modelist: require("ace/ext/modelist"),
  constants: {
    'AJAX_EDITOR_STATE_URL':'/codeeditor/a/editorstate',
    'AJAX_EDITORTAB_URL':'/codeeditor/a/editortab.html',
    'LOCALFILE_URL_PREFIX':'/filebrowser/localfiles',
    'ALERT_URL':'/a/alerts'
  },
  bindEventHandlers: function() {
    $('#workspace').delegate('.editortab-close','click',function(event) {
      event.stopPropagation();
      var divId = $(this).parent().attr('href');
      EditorManager.closeFileInEditor(divId);
    });
    $('#workspace').delegate('.opentab','click',function(event) {
      var selectedId = $(this).children('a:first').attr('href');
      EditorManager.switchSession(selectedId);
    });
  },
  applySettings: function() {
    var wrap = $('#settings-wrap-selection').is(':checked');
    var soft = $('#settings-soft-tabs').is(':checked');
    var invis = $('#settings-show-invisibles').is(':checked');
    var tabsize = Number($('#settings-tab-size').val());
    var fontsize = Number($('#settings-font-size').val());
    this.editor.setOption('wrapBehavioursEnabled',wrap);
    this.editor.setOption('useSoftTabs',soft);
    this.editor.setOption('showInvisibles',invis);
    this.editor.setOption('tabSize',tabsize);
    this.editor.setOption('fontSize',fontsize);
  },
  setUp: function () {
    // EditorManager.editor = ace.edit('editor');
    $('#modal-loading').modal();
    EditorManager.editor.setTheme("ace/theme/monokai");
    $.ajax({
      url: EditorManager.constants.AJAX_EDITOR_STATE_URL,
      type: "GET",
      async: false
    }).done(function(data) {
      if (data==='NO_SAVED_STATE') {
        EditorManager.applySettings();
        EditorManager.loadEditorTab(1,'Untitled-1','-',true);
        EditorManager.bindEventHandlers();
      } else {
        // EditorManager.sessions = JSON.parse(data.sessions);
        $('#settings-form').html(data.settings);
        $('#filesystem').html(data.filesystem);
        // $('#workspace').html(data.editortabs);
        EditorManager.applySettings();
        // EditorManager.currentWorkingDocument = data.currentWorkingDocument;
        // EditorManager.numTabs = data.numTabs;
        // EditorManager.editor.setSession(EditorManager.retrieveSessionByDivId(EditorManager.currentWorkingDocument));
        EditorManager.bindEventHandlers();
        var openFiles = JSON.parse(data.openFiles);
        $.each(openFiles,function(i,item){
          EditorManager.openFileInEditor(item);
        });
      }
      $('#modal-loading').modal('hide');
    });
  },
  tearDown: function() {
    // var sessions = JSON.stringify(EditorManager.sessions);
    var openFiles = [];
    $.each($('#workspace input:not([value="-"])'), function(i,item) {
      openFiles[i]=$(item).attr('value');
    });
    // var editortabs = $('#workspace').html();
    var filesystem = $('#filesystem').html();
    var settings = $('#settings-form').html();
    var args = {
      '_xsrf':getCookie('_xsrf'),
      // 'sessions':sessions,
      // 'currentWorkingDocument':EditorManager.currentWorkingDocument,
      // 'numTabs':EditorManager.numTabs,
      // 'editortabs':editortabs,
      'openFiles':JSON.stringify(openFiles),
      'filesystem':filesystem,
      'settings':settings
    };
    $.post(EditorManager.constants.AJAX_EDITOR_STATE_URL,args,function(data) {
      console.log('State saved!');
      console.log(args);
    });
  },
  loadEditorTab: function(enumeration,filename,filepath,isActive) {
    isActive = typeof isActive !== 'undefined' ? isActive : false;
    var args = {
      'enumeration':enumeration,
      'filename':filename,
      'filepath':filepath,
      'isActive':isActive
    };
    $.get(EditorManager.constants.AJAX_EDITORTAB_URL,args,function(data) {
      $('#editor-tabs').prepend($(data));
    }).then(function() {
      if (filepath!=='-') {
        $.get(EditorManager.constants.LOCALFILE_URL_PREFIX+filepath, function(data) {
          var mode = EditorManager.modelist.getModeForPath(filepath);
          EditorManager.sessions['#editortab-'+enumeration] = ace.createEditSession(data,mode.mode);
          EditorManager.sessions['#editortab-'+enumeration].on('change',EditorManager.markUnsaved);
          $('[href="#editortab-'+enumeration+'"]').trigger('click');
        });
      } else {
        EditorManager.sessions['#editortab-'+enumeration] = ace.createEditSession('',"ace/mode/text");
        EditorManager.sessions['#editortab-'+enumeration].on('change',EditorManager.markUnsaved);
        $('[href="#editortab-'+enumeration+'"]').trigger('click');
      }
    });
  },
  isFileOpen: function (filePath) {
    for (sess in EditorManager.sessions) {
      if ( $('a + [value="'+filePath+'"]').length > 0 ) {
        return true;
      }
    }
    return false;
  },
  isUnsaved: function(divId) {
    var fileTab = $('[href="'+divId+'"] > span:first');
    if ($(fileTab).hasClass('glyphicon-asterisk')) {
      return true;
    } else {
      return false;
    }
  },
  markUnsaved: function (event) {
    var divId = EditorManager.currentWorkingDocument;
    var fileTab = $('[href="'+divId+'"] > span:first');
    if (!$(fileTab).hasClass('glyphicon-asterisk')) {
      $(fileTab).toggleClass('glyphicon-asterisk');
    }
  },
  markSaved: function () {
    var divId = EditorManager.currentWorkingDocument;
    var fileTab = $('[href="'+divId+'"] > span:first');
    if ($(fileTab).hasClass('glyphicon-asterisk')) {
      $(fileTab).toggleClass('glyphicon-asterisk');
    }
  },
  openSaveDialogue: function () {
    if (EditorManager.currentWorkingDocument==='-') {
      AlertManager.displayAlert('danger','No open files.');
      return;
    }
    $('#modal-save').modal();
    $('#modal-save').modal({ keyboard: false });
    $('#modal-save').modal('show');
    var filePath = $('[href="'+EditorManager.currentWorkingDocument+'"] + input').attr('value');
    var fileName = $(EditorManager.currentWorkingDocument+'-filename').text();
    $('#inputFileName').attr('value',fileName);
    if (filePath!=='-') {
      $('#filepath-preview').text(filePath);
    } else {
      $('#modal-button-save').attr('disabled',true);
      $('#filepath-preview').text('--/'+fileName);
    }
  },
  saveFile: function () {
    if (EditorManager.currentWorkingDocument==='-') {
      AlertManager.displayAlert('danger','No open files.');
      return;
    }
    var filePath = $('[href="'+EditorManager.currentWorkingDocument+'"] + input').attr('value');
    if (filePath==='-') {
      EditorManager.openSaveDialogue();
    } else {
      $.ajax({
        beforeSend: function (request) {
          request.setRequestHeader("X-Xsrftoken", getCookie("_xsrf"));
        },
        url: EditorManager.constants.LOCALFILE_URL_PREFIX+filePath,
        data: {"content": EditorManager.editor.getValue()},
        type: "PUT"
      }).done(function (data) {
        EditorManager.markSaved();
      });
    }
  },
  saveAsFile: function (filePath) {
    var args = {'_xsrf':getCookie("_xsrf")};
    $.post( EditorManager.constants.LOCALFILE_URL_PREFIX+filePath, args, function( data ) {
    //   var currentSession = EditorManager.retrieveSessionByDivId(EditorManager.currentWorkingDocument);
      $.ajax({
        beforeSend: function (request) {
          request.setRequestHeader("X-Xsrftoken", getCookie("_xsrf"));
        },
        url: EditorManager.constants.LOCALFILE_URL_PREFIX+filePath,
        data: {"content": EditorManager.editor.getValue()},
        type: "PUT"
      }).done(function (data) {
        EditorManager.markSaved();
      });
    });
  },
  newFileInEditor: function() {
    if ($('#editor').is(':hidden')) {
      $('#editor').show();
    }
    
    var numTabs = this.numTabs + 1;
    this.numTabs++;
    EditorManager.loadEditorTab(numTabs,'Untitled-'+numTabs,'-',true);
  },
  openFileInEditor: function (filePath) {
    if ($('#editor').is(':hidden')) {
      $('#editor').show();
    }
    
    if (EditorManager.isFileOpen(filePath)) {
      $('a + [value="'+filePath+'"]').siblings('a').trigger('click');
      return;
    }
    
    var numTabs = this.numTabs + 1;
    this.numTabs++;
    var fileNameIndex = filePath.lastIndexOf("/") + 1;
    var filename = filePath.substr(fileNameIndex);
    
    EditorManager.loadEditorTab(numTabs,filename,filePath);
  },
  closeFileInEditor: function (divId) {
    function closeFile(divId,e) {
      EditorManager.closeSession(divId);
      $('[href="'+divId+'"]').parent().remove();
      var openTabs = $('#editor-tabs > li');
      if (openTabs.length===1) {
        $('#editor').hide();
        EditorManager.currentWorkingDocument = '-';
      } else {
        $(openTabs[0]).addClass('active');
        $(openTabs[0]).trigger('click');
      }
    }
    if (this.isUnsaved(divId)) {
      ConfirmModalManager.showModal(
        'Unsaved File',
        'Close file without saving?',
        closeFile.curry(divId)
      );
    } else {
      closeFile(divId);
    }
  },
  retrieveSessionByDivId: function (divId) {
    return this.sessions[divId];
  },
  storeSession: function (divId, editSession) {
    this.sessions[divId] = editSession;
  },
  switchSession: function (selectedId) {
    EditorManager.storeSession(EditorManager.currentWorkingDocument,EditorManager.editor.getSession());
    EditorManager.currentWorkingDocument = selectedId;
    EditorManager.editor.setSession(EditorManager.retrieveSessionByDivId(selectedId));
  },
  closeSession: function (divId) {
    delete this.sessions[divId];
    // this.numTabs--;
  },
  undo: function() {
    var uMan = this.sessions[this.currentWorkingDocument].getUndoManager();
    if (uMan.hasUndo()) {
      uMan.undo(dontSelect=false);
    }
  },
  redo: function() {
    var uMan = this.sessions[this.currentWorkingDocument].getUndoManager();
    if (uMan.hasRedo()) {
      uMan.redo(dontSelect=false);
    }
  },
  cut: function() {
    var sel = EditorManager.editor.getCopyText();
    EditorManager.editor.insert('');
    EditorManager.clipboard = sel;
  },
  copy: function() {
    var sel = EditorManager.editor.getCopyText();
    EditorManager.clipboard = sel;
  },
  paste: function() {
    EditorManager.editor.insert(EditorManager.clipboard);
  },
  commentSelection: function() {
    EditorManager.editor.toggleCommentLines();
  }
};