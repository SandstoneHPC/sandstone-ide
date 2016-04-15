'use strict';

(function() {
  getDependencies();

  function getDependencies() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    return $http.get('/a/deps').then(function(response) {
      var depList = ['ui.router'];
      for (var i=0;i<response.data.dependencies.length;i++) {
        depList.push('oide.'+response.data.dependencies[i]);
      }
      depList.push('oide.acemodes');
      depList.push('ui.bootstrap');
      depList.push('oide.filesystemservice');
      depList.push('oide.filetreedirective');
      var oide = getOideModule(depList);

      angular.element(document).ready(function() {
        angular.bootstrap(document, ['oide']);
      });
    });
  }
}());
