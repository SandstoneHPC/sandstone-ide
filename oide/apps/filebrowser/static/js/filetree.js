var FileTree = {
  bindEventHandlers: function(parentDivId,multiSelect) {
    parentDivId = '#'+parentDivId;
    if (multiSelect) {
      //bind multiSelect handlers
      //$(parentDivId).delegate('.file .directory','click',eventHandler);
      $(parentDivId).delegate('.file, .directory','click',FileTree.multiSelect.onItemSelect);
      $(parentDivId).delegate('.directory-icon','click',FileTree.util.onDirectoryClick);
    } else {
      //bind singleSelect handlers
      $(parentDivId).delegate('.file, .directory','click',FileTree.singleSelect.onItemSelect);
      $(parentDivId).delegate('.directory-icon','click',FileTree.util.onDirectoryClick);
    }
  },
  addCustomEventHandler: function(parentDivId,selector,eventName,eventHandler) {
    parentDivId = '#'+parentDivId;
    $(parentDivId).delegate(selector,'click',eventHandler);
  },
  startPolling: function(filetreeIds,refreshInterval) {
    refreshInterval = typeof refreshInterval!==undefined ? refreshInterval:2000;
    FileTree.util.refreshInterval = refreshInterval;
    for (var i in filetreeIds) {
      FileTree.util.pollOpenDirectoryContents(filetreeIds[i]);
    }
  },
  getFiletreeId: function(el) {
    var fid = $(el).parents('.filetree-container').parent().attr('value');
    return fid;
  },
  util: {
    constants: {
      'AJAX_DIR_URL': '/filebrowser/filetree/a/dir',
      'AJAX_ENTRY_URL': '/filebrowser/filetree/a/entry',
      'AJAX_UPDATE_URL': '/filebrowser/filetree/a/update',
    },
    refreshInterval: 2000,
    safeToUpdate: true,
    eliminateDuplicates: function(arr) {
      var i,
        len=arr.length,
        out=[],
        obj={};
      for (i=0;i<len;i++) {
        obj[arr[i]]=0;
      }
      for (i in obj) {
        out.push(i);
      }
      return out;
    },
    onDirectoryClick: function (event) {
      event.stopPropagation();
      var sub_ul = $(this).siblings('ul:first');
  
      if (!$(this).parent().hasClass('loaded')) {
        if (!$(this).hasClass('glyphicon-hdd')) {
          $(this).switchClass( "glyphicon-folder-close", "glyphicon-folder-open" );
        }
        var thisDir = $(this).parent();
        var args = { 'dirpath': $(this).siblings('input:first').attr('value') };
        $.ajax({
          url: FileTree.util.constants.AJAX_DIR_URL,
          type: "GET",
          async: false,
          data: args,
        }).done(function(data) {
          FileTree.util.loadDirectoryContents(0,data.dir_contents,sub_ul);
          $(thisDir).addClass('loaded');
        });
      } else {
        $(sub_ul).toggle();
        if (!$(this).hasClass('glyphicon-hdd')) {
          if ($(this).hasClass('glyphicon-folder-open')) {
            $(this).switchClass( "glyphicon-folder-open", "glyphicon-folder-close" );
          } else {
            $(this).switchClass( "glyphicon-folder-close", "glyphicon-folder-open" );
          }
        }
      }
    },
    loadDirectoryContents: function(index,contents,parentList) {
      var item = contents[index];
      if (item===undefined) {
        return;
      }
      index++;
      var args = {
        'isDir':item[2],
        'filePath':item[1],
        'fileName':item[0],
      };
      $.ajax({
        url: FileTree.util.constants.AJAX_ENTRY_URL,
        type: "GET",
        async: false,
        data: args,
      }).done(function(data) {
        $(parentList).append($(data));
        if (index<contents.length) {
          FileTree.util.loadDirectoryContents(index,contents,parentList);
        }
      });
    },
    updateOpenDirectoryContents: function(filetreeId) {
      if (FileTree.util.safeToUpdate) {
        FileTree.util.safeToUpdate = false;
      } else {
        return;
      }
      var fid = '#'+filetreeId;
      var loadedDirs = [];
      var index = 0;
      $.each($(fid+' .loaded'),function(i,item) {
        var dirpath = $(item).children('input:first').attr('value');
        if ($.inArray(dirpath,loadedDirs)===-1) {
          loadedDirs[index]=dirpath;
          index++;
        }
      });
      if (loadedDirs.length > 0) {
        var args = {'loadedDirs':loadedDirs};
        $.ajax({
          url: FileTree.util.constants.AJAX_UPDATE_URL,
          type: "GET",
          async: false,
          data: args,
        }).done(function(updatedDirs) {
          FileTree.util.refreshInterval = 2000;
          $.each(loadedDirs, function(i,item) {
            var uDir = updatedDirs[item];
            if (uDir===undefined) {
              $( fid+' input[value="'+item+'"]').parent().remove();
            } else {
              var dir = $(fid+' input[value="'+item+'"]:last ~ ul');
              var j = 0;
              var k = 0;
              var oldEntries = $(dir).children('li').children('input');
              while (!((j>=oldEntries.length)&&(k>=uDir.length))) {
                try {
                  var oldEntry = $(oldEntries[j]).attr('value');
                  var oldEntryLower = oldEntry.toLowerCase();
                  if (k<uDir.length) {
                    var newEntryLower = uDir[k][1].toLowerCase();
                    if ((oldEntryLower<newEntryLower)&&(!(oldEntry.substr(-1)==='/')&&uDir[k][2])) {
                      var args = {
                        'isDir':uDir[k][2],
                        'filePath':uDir[k][1],
                        'fileName':uDir[k][0],
                      };
                      $.ajax({
                        url: FileTree.util.constants.AJAX_ENTRY_URL,
                        type: "GET",
                        async: false,
                        data: args,
                      }).done(function(data) {
                        $(data).insertBefore($(fid+' input[value="'+oldEntry+'"]').parent());
                        k++;
                      });
                    } else if ((oldEntryLower>newEntryLower)&&((oldEntry.substr(-1)==='/')&&!uDir[k][2])) {
                      $(fid+' input[value="'+oldEntry+'"]').parent().remove();
                      j++;
                    } else if (oldEntryLower>newEntryLower) {
                      var args = {
                        'isDir':uDir[k][2],
                        'filePath':uDir[k][1],
                        'fileName':uDir[k][0],
                      };
                      $.ajax({
                        url: FileTree.util.constants.AJAX_ENTRY_URL,
                        type: "GET",
                        async: false,
                        data: args,
                      }).done(function(data) {
                        $(data).insertBefore($(fid+' input[value="'+oldEntry+'"]').parent());
                        k++;
                      });
                    } else if (oldEntryLower == newEntryLower) {
                      j++;
                      k++;
                    } else if (oldEntryLower < newEntryLower) {
                      $(fid+' input[value="'+oldEntry+'"]').parent().remove();
                      j++;
                    }
                  } else {
                    $(fid+' input[value="'+oldEntry+'"]').parent().remove();
                    j++;
                  }
                } catch(err) {
                  var emptyDir = $(dir);
                  var lastEntry = $(dir).children('li:last').children('input:first').attr('value');
                  var args = {
                    'isDir':uDir[k][2],
                    'filePath':uDir[k][1],
                    'fileName':uDir[k][0],
                  };
                  $.ajax({
                    url: FileTree.util.constants.AJAX_ENTRY_URL,
                    type: "GET",
                    async: false,
                    data: args,
                  }).done(function(data) {
                    if (typeof lastEntry != 'undefined') {
                      $(lastEntry).append($(fid+' input[value="'+lastEntry+'"]').parent());
                    } else {
                      $(emptyDir).append($(data));
                    }
                    k++;
                  });
                }
              }
            }
          });
        }).fail(function() {
          FileTree.util.refreshInterval = FileTree.util.refreshInterval*2;
          console.log('Cannot contact server for filetree update, retrying in '+FileTree.util.refreshInterval/1000+'seconds.');
        });
      }
      FileTree.util.safeToUpdate = true;
      // FileTree.util.updateOpenDirectoryContents(filetreeId);
    },
    pollOpenDirectoryContents: function(filetreeId) {
      FileTree.util.updateOpenDirectoryContents(filetreeId);
      // Long-poll FileTreeUpdateHandler for refreshed dir contents
      setTimeout(function() {FileTree.util.pollOpenDirectoryContents(filetreeId);}, FileTree.util.refreshInterval);
    },
  },
  singleSelect: {
    onItemSelect: function (event) {
      event.stopPropagation();
      $('.selected').toggleClass('selected');
      $(this).toggleClass('selected');
      $(this).siblings('span').toggleClass('selected');
    },
  },
  multiSelect: {
    onItemSelect: function (event) {
      event.stopPropagation();
      if (!event.ctrlKey) {
        $('.selected').toggleClass('selected');
      }
      $(this).toggleClass('selected');
      $(this).siblings('span').toggleClass('selected');
    },
  },
  custom: {},
};
