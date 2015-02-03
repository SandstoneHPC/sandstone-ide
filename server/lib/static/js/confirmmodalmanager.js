var ConfirmModalManager = {
  modalId: '#modal-confirm',
  modalButtonId: '#modal-button-confirm',
  clickCloseHandler: function(e) {
    $(ConfirmModalManager.modalId).modal('hide');
  },
  setTitle: function(title) {
    $(this.modalId+' .modal-title').text(title);
  },
  setMessage: function(message) {
    $(this.modalId+' .modal-body > span').text(message);
  },
  setHandler: function(eventHandler) {
    var confButton = $(this.modalButtonId);
    confButton.unbind('click');
    confButton.click(eventHandler);
    confButton.click(this.clickCloseHandler);
  },
  showModal: function(title,message,handler) {
    this.setTitle(title);
    this.setMessage(message);
    this.setHandler(handler);
    $(this.modalId).modal();
  },
};
