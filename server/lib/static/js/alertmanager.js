var AlertManager = {
  util: {
    constants: {
      'ALERT_URL':'/a/alerts',
    },
  },
  displayAlert: function(alertType,alertMessage) {
    var args = {
      'alertType':alertType,
      'alertMessage':alertMessage,
    };
    $.get(AlertManager.util.constants.ALERT_URL, args, function(alert) {
      $(alert).appendTo($('#alert-area'));
    });
  },
};
