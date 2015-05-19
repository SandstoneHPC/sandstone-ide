/*
 * This is a very customized implementation of the jQuery File Upload plugin 
 * configured to work with nginx.
 */
 
$(function() {
  var calculateProgress, cancelAllUploads, cancelUpload, createProgressBar, 
  fileName, files, maxChunkSize, startAllUploads, startUpload, uploadedFilePath;
 
  // A container to hold all of the upload data objects.
  files = [];
 
  /*
   * A simple method to calculate the progress for an individual file upload.
   */
  calculateProgress = function(data) {
    var value;
    value = parseInt(data.loaded / data.total * 100, 10) || 0;
    return value + "%";
  };
 
  /*
   * Get the name of the file from the upload data.
   */
  fileName = function(data) {
    return data.files[0].name;
  };
 
  /*
   * Returns the path to the uploaded file on the server. 
   */
  uploadedFilePath = function(data) {
    var response;
    response = JSON.parse(data.result);
    if (response.files) {
      return response.files[0][".path"];
    } else {
      return response[".path"];
    }
  };
 
  /*
   * Cancels the upload for a file found at 'index' in the 'files' container.
   */
  cancelUpload = function(index) {
    if (files[index]) {
      files[index].jqXHR.abort();
    }
  };
 
  /*
   * Starts the upload for a file found at 'index' in the 'files' container.
   * If the file upload was interrupted, the 'uploadedBytes' attribute will be
   * reset to continue from where it left off.
   */
  startUpload = function(index) {
    var context, data;
    data = files[index];
    context = data.context;
    data.uploadedBytes = parseInt($(context).attr("uploadedBytes"), 10);
    data.data = null;
    $(data).submit();
  };
 
  cancelAllUploads = function() {
    $(files).each(function(index, file) {
      cancelUpload(index);
    });
  };
 
  startAllUploads = function() {
    $(files).each(function(index, data) {
      startUpload(index);
    });
  };
 
  createProgressBar = function(progress) {
    // return '<span class="bar" style="width: ' + progress + '">' + progress + '</span>';
    return '<span class="bar">' + progress + '</span>';
  };
 
 
  /*
   * IMPORTANT: There are some very important settings to mention:
   *
   * maxChunkSize:
   * Nginx and this plugin require a very specific setting for chunk sizes. 
   * Changing this may affect the performance and reliability of your upload. 
   *
   * For a more in-depth explanation of the settings or the benchmarks performed
   * to get this setting, read this document: https://gist.github.com/3920385.
   *
   * multipart:
   * This must be set to 'false'. If set to 'true', then the upload will send
   * in a single chunk, rather than multiple chunks.
   *
   * dataType:
   * This cannot be set for chunked uploads! Setting this option to 'json' 
   * resulted in failed chunked uploads. 
   *
   */
  $("#fileupload").fileupload({
    maxChunkSize: 1024 * 256,
    maxRetries: 15,
    retryTimeout: 1000,
    multipart: false,
    add: function(e, data) {
      // Collect some basic information about the file.
      var progress = calculateProgress(data);
      var filename = fileName(data);
 
      // A count of the number of rows (current file uploads)
      var index = $("#files tr").length;
 
      // Create a start and stop button for this specific upload. The 'data-file' 
      // attribute is used to pass the index of this upload to the cancelUpload
      // and startUpload methods.
      var cancelButton = $('<button type="button" class="btn btn-warning btn-sm" data-file="' + index + '">Cancel upload</button>');
      var startButton = $('<button type="button" class="btn btn-success btn-sm" data-file="' + index + '">Start upload</button>');
 
      // Cancel this specific upload when this button is clicked
      cancelButton.click(function() {
        cancelUpload($(this).attr("data-file"));
      });
 
      // Start/Resume this specific upload when this button is clicked
      startButton.click(function() {
        startUpload($(this).attr("data-file"));
      });
 
      // Create a new, empty row that will serve as the context for this file
      // upload.
      var row = $('<tr><td class="filename"></td><td class="progress"></td><td class="start"></td><td class="cancel"></td>');
 
      // nginx requires us to specify a session id so that it can handle chunked
      // uploads. Here, we're using the current time and the file's encoded name 
      // to generate this token.
      //
      // Note: This will require you to use the jQuery base64 plugin.
      // var sessionID = new Date().getTime() + '_' 
      //   + $.base64.encode(filename).replace(/\+|=|\//g, '');
      var hash = 0, i, chr, len;
      if (filename.length == 0) return hash;
      for (i = 0, len = filename.length; i < len; i++) {
        chr   = filename.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      var sessionID = hash;
 
      // Set all the information for this upload on the context (row) for easier
      // access
      $(row).find(".filename").text(filename);
      $(row).find(".progress").html(createProgressBar(progress));
      $(row).find(".start").append(startButton);
      $(row).find(".cancel").append(cancelButton);
      $(row).attr("sessionID", sessionID);
 
      // Add the new file upload row to our list (table) of file uploads
      $(row).appendTo("#files");
 
      // Assign this row to this upload's context
      data.context = row;
 
      // Add this upload data to our files container
      files.push(data);
    },
 
    /* 
     * Do something when the upload is done. This example replaces the progress
     * bar we've been using with the path to the uploaded file on the server.
     */
    done: function(e, data) {
      data.context.find(".progress").html(uploadedFilePath(data));
    },
 
    /*
     * This method is called whenever progress is reported back from nginx.
     * Here, we're simply updating our progress bar to show the current progress.
     * We're also clearing out any previous retry attempts once progress has
     * been made.
     */
    progress: function(e, data) {
      var progress;
      data.context.removeData("retries");
      progress = calculateProgress(data);
      data.context.find(".progress").html(createProgressBar(progress));
    },
    
    /*
     * This callback keeps track of the combined progress for all active uploads.
     */
    progressall: function (e, data) {
      var progress = calculateProgress(data);
      $("#total_progress").text(progress);
    },
 
 
    /*
     * This method prepares the chunk that is about to be uploaded.
     */
    beforeSend: function(e, files, index, xhr, handler, callback) {
      var chrome, context, device, file, filename, filesize, ios, sessionID;
 
      // Retrieve the file that is about to be sent to nginx
      file = files.files[0];
 
      // Collect some basic file information
      filename = file.name;
      filesize = file.size;
 
      // Grab the context (table row) for this upload
      context = files.context[0];
 
      // Get the generated sessionID for this upload
      sessionID = $(context).attr("sessionID");
 
      // Set uploadedBytes on the context to ensure that if this upload was
      // resumed, it will continue from where it left off.
      $(context).attr("uploadedBytes", files.uploadedBytes);
 
      // Set the required headers for the nginx upload module
      e.setRequestHeader("Session-ID", sessionID);
      e.setRequestHeader("X-Requested-With", "XMLHttpRequest");
       
      e.setRequestHeader("X-Xsrftoken", getCookie("_xsrf"));
      e.setRequestHeader("basepath", $('#upload_basepath').text());
      
      device = navigator.userAgent.toLowerCase();
      ios = device.match(/(iphone|ipod|ipad)/);
      chrome = device.match(/crios/);
 
      if (ios && !chrome) {
        e.setRequestHeader("Cache-Control", "no-cache");
      }
    },
 
    /*
     * This method will be called whenever an upload (or a single chunk) fails
     * to complete. In this case, we're setting up an auto-resume feature to
     * attempt the upload again (respecting our retry and timeout settings).
     */
    fail: function(e, data) {
      var maxRetries, retryCount, retryTimeout, row;
      
      // Get the context for this upload
      row = $(data.context[0]);
 
      // Grab its current retry count
      retryCount = row.data("retries") || 1;
 
      // Get our maxRetries and retryTimeout settings
      maxRetries = $(this).data("fileupload").options.maxRetries + 1;
      retryTimeout = $(this).data("fileupload").options.retryTimeout;
 
      // If we can still attempt a retry
      if (retryCount < maxRetries) {
        window.setTimeout(function() {
          // Set the row's progress bar section to display that we are trying again
          row.find(".progress").html("<label>Retry #" + retryCount + "</label>");
 
          // Increment the retry count and set it back on the row
          row.data("retries", retryCount += 1);
 
          // Reassign the uploadedBytes, then submit to start the upload again.
          data.uploadedBytes = parseInt(row.attr("uploadedBytes"), 10);
          data.data = null;
          $(data).submit();
        }, retryCount * retryTimeout);
 
      } else {
        // We've met our retry limit. Indicate that this upload has failed.
        row.find(".progress").html("<label>Upload failed</label>");
      }
    }
  });
 
  /*
   * A convenient method for triggering the upload of multiple files from the 
   * click of a button.
   */
  $("#start_upload").click(function() {
    startAllUploads();
  });
 
  /*
   * A convenient method for triggering the cancellation of multiple files from 
   * the click of a button.
   */
  $("#stop_uploads").click(function() {
    cancelAllUploads();
  });
});
