var ContextMenuManager = {
  setUpMenus: function() {
    $.each(ContextMenuManager.menus, function(i,item) {
      $.contextMenu(item);
    });
  },
  menus: {},
  callbacks: {},
};
