'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    return $http.get('/a/deps').then(function(response) {
      var depList = ['ui.router'];
      for (var i=0;i<response.data.dependencies.length;i++) {
        depList.push('sandstone.'+response.data.dependencies[i]);
      }
      depList.push('sandstone.acemodes');
      depList.push('ui.bootstrap');
      depList.push('sandstone.filesystemservice');
      depList.push('sandstone.filetreedirective');
      depList.push('sandstone.broadcastservice');
      var sandstone = getSandstoneModule(depList);

      angular.element(document).ready(function() {
        angular.bootstrap(document, ['sandstone']);
      });
    });
  }
}());
