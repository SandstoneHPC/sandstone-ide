ContextMenuManager.callbacks.filetreeDelete = function(key, options) {
  var hiddenInput = $(this).siblings('input');
  var filePath = hiddenInput.attr('value');
  ConfirmModalManager.showModal(
    'Delete File or Folder',
    'Are you sure you want to delete '+filePath+'?',
    function(filePath,e) {
      FileManager.deleteFile(filePath);
    }.curry(filePath));
  // var fid = FileTree.getFiletreeId($(this));
  // FileTree.util.updateOpenDirectoryContents(fid);
};

ContextMenuManager.callbacks.filetreeRename = function(key, options) {
  var hiddenInput = $(this).siblings('input');
  var oldPath = hiddenInput.attr('value');
  var oldName = $(this).text();
  var oldElement = $(this);
  $(this).replaceWith($('<input type="text" class="input-rename" id="fileRename" name="newFileName">'));
  var input = $('#fileRename');
  $(input).val(oldName);
  $(input).focusout(function(event) {
    $(input).replaceWith($(oldElement));
  });
  $(input).keypress(function (e) {
   var key = e.which;
   if(key == 13) {
      var newFileName = $(input).val();
      $(input).focusout();
      $(oldElement).text(newFileName);
      var newPath = FileManager.renameFile(oldPath,newFileName);
      var editorTabInput = $('#workspace input[value="'+oldPath+'"]')
      $(editorTabInput).attr('value',newPath);
      var editorTab = editorTabInput.siblings('a').attr('href');
      $(editorTab+'-filename').text(newFileName);
      $(hiddenInput).attr('value',newPath);
      // var fid = FileTree.getFiletreeId($(input));
      // FileTree.util.updateOpenDirectoryContents(fid);
    }
  });
  $(input).focus();
};

ContextMenuManager.callbacks.filetreeCopy = function(key,options) {
  var hiddenInput = $(this).siblings('input');
  var origPath = $(hiddenInput).attr('value');
  FileManager.setClipboard(origPath);
};

ContextMenuManager.callbacks.filetreePaste = function(key,options) {
  var hiddenInput = $(this).siblings('input');
  var filePath = $(hiddenInput).attr('value');
  var fileNameIndex = filePath.lastIndexOf('/')+1;
  var newBaseDir = filePath.substr(0,fileNameIndex);
  var newPath = '';
  var origPath = FileManager.getClipboard();
  var origFileNameIndex = 0;
  if (origPath.substr(-1)==='/') {
    origFileNameIndex = (origPath.substr(0,origPath.length-1)).lastIndexOf('/');
  } else {
    origFileNameIndex = origPath.lastIndexOf('/');
  }
  var fileName = origPath.substr(origFileNameIndex);
  newPath = newBaseDir+fileName;
  newPath = FileManager.copyFile(origPath,newPath);
  // var fid = FileTree.getFiletreeId($(this));
  // FileTree.util.updateOpenDirectoryContents(fid);
};

ContextMenuManager.callbacks.filetreeMakeExec = function(key,options) {
  var icon = $(this).siblings('span:first');
  icon.removeClass('glyphicon-file');
  icon.addClass('glyphicon-chevron-right');
  var hiddenInput = $(this).siblings('input');
  var filePath = $(hiddenInput).attr('value');
  FileManager.makeExecutable(filePath);
};

ContextMenuManager.callbacks.filetreeUpload = function(key, options) {
  var hiddenInput = $(this).siblings('input');
  $('#modal-upload').modal();
  $('#modal-upload').modal({ keyboard: false });
  $('#upload_basepath').text(hiddenInput.attr('value'));
  $('#modal-upload').modal('show');
};


ContextMenuManager.menus.directoryContextMenu = {
  selector: '.directory', 
  callback: function(key, options) {
    var m = "clicked: " + key;
    window.console && console.log(m) || alert(m); 
  },
  items: {
    "copy": {
      name: "Copy",
      callback: ContextMenuManager.callbacks.filetreeCopy,
    },
    "paste": {
      name: "Paste",
      callback: ContextMenuManager.callbacks.filetreePaste,
    },
    "sep1": "---------",
    "delete": {
      name: "Delete",
      callback: ContextMenuManager.callbacks.filetreeDelete,
    },
    // "rename": {
    //   name: "Rename",
    //   callback: ContextMenuManager.callbacks.filetreeRename,
    // },
    "sep2": "---------",
    "newfile": {
      name: "New File",
      callback: function(key, options) {
        var dir = $(this.parent());
        if (!$(dir).hasClass('loaded')) {
          $(this).siblings('directory-icon').trigger('click');
        }
        var index = 1;
        var dirpath = $(dir).children('input').attr('value');
        var filename = 'Untitled-'+index;
        while (FileManager.fileExists(dirpath+filename)) {
          index++;
          filename = 'Untitled-'+index;
        }
        FileManager.createNewFile(dirpath,filename);
        // var fid = FileTree.getFiletreeId($(this));
        // FileTree.util.updateOpenDirectoryContents(fid);
      }
    },
    "newfolder": {
      name: "New Folder",
      callback: function(key, options) {
        var dir = $(this.parent());
        if (!$(dir).hasClass('loaded')) {
          $(this).siblings('directory-icon').trigger('click');
        }
        var index = 1;
        var dirpath = $(dir).children('input').attr('value');
        var dirname = 'UntitledFolder'+index;
        while (FileManager.fileExists(dirpath+dirname)) {
          index++;
          dirname = 'UntitledFolder'+index;
        }
        FileManager.createNewDirectory(dirpath,dirname);
      }
    },
    "upload": {
      name: "Upload Files",
      callback: ContextMenuManager.callbacks.filetreeUpload,
    },
  }
};
ContextMenuManager.menus.fileContextMenu = {
  selector: '.file', 
  callback: function(key, options) {
    var m = "clicked: " + key;
    window.console && console.log(m) || alert(m); 
  },
  items: {
    "open": {
      name: "Open In Editor",
      callback: function (key, options) {
        if ($(this).hasClass('selected')) {
          var selectedFiles = $('[class~="file"][class~="selected"]');
          for (var i=0; i < selectedFiles.length; i++) {
            var f = $(selectedFiles[i]).siblings('input:first').attr('value');
            EditorManager.openFileInEditor(f);
          }
        } else {
          var f = $(this).siblings('input:first').attr('value');
          EditorManager.openFileInEditor(f);
        }
      }
    },
    "sep1": "---------",
    "copy": {
      name: "Copy",
      callback: ContextMenuManager.callbacks.filetreeCopy,
    },
    "paste": {
      name: "Paste",
      callback: ContextMenuManager.callbacks.filetreePaste,
    },
    "sep2": "---------",
    "delete": {
      name: "Delete",
      callback: ContextMenuManager.callbacks.filetreeDelete,
    },
    "rename": {
      name: "Rename",
      callback: ContextMenuManager.callbacks.filetreeRename,
    },
    "sep3": "---------",
    "makexec": {
      name: "Make File Executable",
      callback: ContextMenuManager.callbacks.filetreeMakeExec,
    },
  }
};
