$('#menu-file-new').click(function(e) {
  $('#workspace .active').toggleClass('active');
  EditorManager.newFileInEditor();
});

$('#menu-file-open').click(function(e) {
  $('.selected').toggleClass('selected');
  $('#modal-open').modal();
  $('#modal-open').modal({ keyboard: false });
  $('#modal-open').modal('show');
});

$('#menu-file-save').click(function(e) {
  EditorManager.saveFile();
});

$('#menu-file-save-as').click(function(e) {
  EditorManager.openSaveDialogue();
});

$('#menu-file-close').click(function(e) {
  var activeTab = $('#editor-tabs > li.active');
  if (activeTab.length>0) {
    var divId = $(activeTab).children('a:first').attr('href');
    EditorManager.closeFileInEditor(divId);
  }
});

$('#menu-file-close-all').click(function(e) {
  var openTabs = $('#editor-tabs > li').filter(
    function () {
      return $(this).children('a:first').attr('href') !== '#editortab-new';
    }
  );
  for (var i=0; i<openTabs.length; i++) {
    var divId = $(openTabs[i]).children('a:first').attr('href');
    EditorManager.closeFileInEditor(divId);
  }
});

$(window).keydown(function(e) {
  if (e.which==79&&e.ctrlKey) {
    e.preventDefault();
    $('.selected').toggleClass('selected');
    $('#modal-open').modal();
    $('#modal-open').modal({ keyboard: false });
    $('#modal-open').modal('show');
  } else if (e.which==83&&e.ctrlKey&&e.shiftKey) {
    e.preventDefault();
    EditorManager.openSaveDialogue();
  } else if (e.which==83&&e.ctrlKey) {
    e.preventDefault();
    EditorManager.saveFile();
  }
});

$('#menu-edit-undo').click(function(e) {
  EditorManager.undo();
});

$('#menu-edit-redo').click(function(e) {
  EditorManager.redo();
});

$('#menu-edit-cut').click(function(e) {
  EditorManager.cut();
});

$('#menu-edit-copy').click(function(e) {
  EditorManager.copy();
});

$('#menu-edit-paste').click(function(e) {
  EditorManager.paste();
});

$('#menu-edit-comment-selection').click(function(e) {
  EditorManager.commentSelection();
});

$('#find-find-previous').click(function(e) {
  EditorManager.editor.findPrevious();
});

$('#find-find-next').click(function(e) {
  var searchString = $('#find-string').val();
  EditorManager.editor.find(searchString,{
    backwards: false,
    wrap: $('#find-wrap-around').is(':checked'),
    caseSensitive: $('#find-case-sensitive').is(':checked'),
    wholeWord: $('#find-whole-word').is(':checked'),
    regExp: $('#find-regular-expressions').is(':checked'),
  });
});

$('#find-replace-current').click(function(e) {
  var replaceString = $('#replace-string').val();
  EditorManager.editor.replace(replaceString);
});

$('#find-replace-all').click(function(e) {
  var replaceString = $('#replace-string').val();
  var searchString = $('#find-string').val();
  EditorManager.editor.find(searchString,{
    backwards: false,
    wrap: $('#find-wrap-around').is(':checked'),
    caseSensitive: $('#find-case-sensitive').is(':checked'),
    wholeWord: $('#find-whole-word').is(':checked'),
    regExp: $('#find-regular-expressions').is(':checked'),
  });
  EditorManager.editor.replaceAll(replaceString);
});

$('#settings-wrap-selection').change(function(e) {
  var wrapCheck = $('#settings-wrap-selection');
  var wrap = wrapCheck.is(':checked');
  if (wrap) {
    wrapCheck.attr('checked','checked');
  } else {
    wrapCheck.attr('checked',null);
  }
  EditorManager.editor.setOption('wrapBehavioursEnabled',wrap);
});

$('#settings-soft-tabs').change(function(e) {
  var softCheck = $('#settings-soft-tabs');
  var soft = softCheck.is(':checked');
  if (soft) {
    softCheck.attr('checked','checked');
  } else {
    softCheck.attr('checked',null);
  }
  EditorManager.editor.setOption('useSoftTabs',soft);
});

$('#settings-show-invisibles').change(function(e) {
  var invisCheck = $('#settings-show-invisibles');
  var invis = invisCheck.is(':checked');
  if (invis) {
    invisCheck.attr('checked','checked');
  } else {
    invisCheck.attr('checked',null);
  }
  EditorManager.editor.setOption('showInvisibles',invis);
});

$('#settings-tab-size').change(function(e) {
  var tabSelect = $('#settings-tab-size');
  var tabsize = Number(tabSelect.val());
  tabSelect.children('[selected="selected"]').attr('selected',null);
  tabSelect.children('[value='+tabsize+']').attr('selected','selected');
  EditorManager.editor.setOption('tabSize',tabsize);
});

$('#settings-font-size').change(function(e) {
  var fontSelect = $('#settings-font-size');
  var fontsize = Number(fontSelect.val());
  fontSelect.children('[selected="selected"]').attr('selected',null);
  fontSelect.children('[value='+fontsize+']').attr('selected','selected');
  EditorManager.editor.setOption('fontSize',fontsize);
});
     

$('#modal-button-open').click(function(e) {
  var selectedFiles = $('[class~="file"][class~="selected"]');
  for (var i=0; i < selectedFiles.length; i++) {
    var f = $(selectedFiles[i]).siblings('input:first').attr('value');
    if (!EditorManager.isFileOpen(f)) {
      EditorManager.openFileInEditor(f);
    }
  }
  $('.selected').toggleClass('selected');
  $('#modal-open').modal('hide');
});

$('#modal-button-save').click(function(e) {
  //Fill out input value, rename tabs
  //Call saveAs
  var tmpFilePath = $('#filepath-preview').text();
  var fileName = $('#inputFileName').val();
  var fileNameIndex = tmpFilePath.lastIndexOf('/')+1;
  var basePath = tmpFilePath.substr(0,fileNameIndex);
  var filePath = basePath+fileName;
  
  $(EditorManager.currentWorkingDocument+'-filename').text(fileName);
  $('[href="'+EditorManager.currentWorkingDocument+'"] + input').attr('value',filePath);
  
  EditorManager.saveAsFile(filePath);
  $('#modal-save').modal('hide');
});

$('#modal-button-save-close').click(function(e) {
  if ($('#modal-button-save').prop('disabled')) {
    $('#modal-button-save').attr('disabled',false);
  }
  $('#modal-save-filetree-wrapper .selected').toggleClass('selected');
});

$("#inputFileName").bind('input', function(event) {
   var fileName = $(this).val();
   var filePath = $("#filepath-preview").text();
   var basePath = filePath.substr(0,filePath.lastIndexOf('/')+1);
   $('#filepath-preview').text(basePath+fileName);
});

$('#workspace [href="#editortab-new"]').click(function(e) {
  e.preventDefault();
  $('#workspace .active').toggleClass('active');
  EditorManager.newFileInEditor();
  setTimeout(function(){$('#workspace [href="#editortab-new"]').parent().removeClass('active');},100);
});
