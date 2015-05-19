var FileManager = {
  util: {
    constants: {
      'LOCALFILE_URL_PREFIX':'/filebrowser/localfiles',
      'AJAX_FILEUTIL_URL':'/filebrowser/a/fileutil',
    },
    clipboard: '',
  },
  setClipboard: function(filepath) {
    FileManager.util.clipboard = filepath;
  },
  getClipboard: function() {
    return FileManager.util.clipboard;
  },
  fileExists: function(filepath) {
    var args = {'operation':'CHECK_EXISTS','filepath':filepath};
    var result = false;
    $.ajax({
      type: "GET",
      url: FileManager.util.constants.AJAX_FILEUTIL_URL,
      data: args,
      async: false,
    }).done(function(data) {
      result = data.result;
    });
    return result;
  },
  createNewFile: function(dirpath,filename) {
    var args = {'_xsrf':getCookie("_xsrf")};
    $.ajax({
      type: "POST",
      url: FileManager.util.constants.LOCALFILE_URL_PREFIX+dirpath+filename,
      data: args,
      async: false,
      }).done(function(data) {
        return data;
      });
  },
  createNewDirectory: function(dirpath,dirname) {
    var args = {'_xsrf':getCookie("_xsrf"),'isDir':true};
    $.ajax({
      type: "POST",
      url: FileManager.util.constants.LOCALFILE_URL_PREFIX+dirpath+dirname,
      data: args,
      async: false,
      }).done(function(data) {
        return data;
      });
  },
  deleteFile: function(filepath) {
    $.ajax({
      beforeSend: function (request)
        {
          request.setRequestHeader("X-Xsrftoken", getCookie("_xsrf"));
        },
      type: "DELETE",
      url: FileManager.util.constants.LOCALFILE_URL_PREFIX+filepath,
    }).done(function(data) {
      return data;
    });
  },
  renameFile: function(filepath,newFileName) {
    var args = {
      '_xsrf':getCookie("_xsrf"),
      'operation':'RENAME',
      'filepath':filepath,
      'newFileName':newFileName};
    var result = filepath;
    $.ajax({
      type: "POST",
      url: FileManager.util.constants.AJAX_FILEUTIL_URL,
      data: args,
      async: false,
    }).done(function(data) {
      result = data.result;
    });
    return result;
  },
  copyFile: function(origpath,newpath) {
    var args = {
      '_xsrf':getCookie("_xsrf"),
      'operation':'COPY',
      'origpath':origpath,
      'newpath':newpath};
    var result = origpath;
    $.ajax({
      type: "POST",
      url: FileManager.util.constants.AJAX_FILEUTIL_URL,
      data: args,
      async: false,
    }).done(function(data) {
      result = data.result;
    });
    return result;
  },
  makeExecutable: function(filepath) {
    var args = {
      '_xsrf':getCookie("_xsrf"),
      'operation':'MAKE_EXEC',
      'filepath':filepath
    };
    var result = filepath;
    $.ajax({
      type: "POST",
      url: FileManager.util.constants.AJAX_FILEUTIL_URL,
      data: args,
      async: false,
    }).done(function(data) {
      result = data.result;
    });
    return result;
  }
};
