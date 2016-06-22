'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var depList = %(dep_list)s;
    var sandstone = getSandstoneModule(depList);

    angular.element(document).ready(function() {
      angular.bootstrap(document, ['sandstone']);
    });
  }
}());
