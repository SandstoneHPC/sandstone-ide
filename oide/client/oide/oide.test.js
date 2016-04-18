'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var depList = %(dep_list)s;
    var oide = getOideModule(depList);

    angular.element(document).ready(function() {
      angular.bootstrap(document, ['oide']);
    });
  }
}());
