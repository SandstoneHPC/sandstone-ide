'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var depList = [
        'ui.router',
        'oide.editor',
        'oide.terminal',
        'oide.acemodes',
        'ui.bootstrap'
      ]
    var oide = getOideModule(depList);

    angular.element(document).ready(function() {
      angular.bootstrap(document, ['oide']);
    });
  }
}());
