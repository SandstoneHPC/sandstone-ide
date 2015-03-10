'use strict';

angular.module('oide.states', [])
.factory('StateService', ['$http', '$log', function($http,$log) {
  var storeState = function () {
    $http({
      url: '/a/state',
      method: 'POST',
      params: {
        _xsrf: getCookie('_xsrf'),
        state: JSON.stringify(state)
      }
    })
    .success(function (data, status, headers, config) {
      $log.debug('Stored state for user.');
    })
    .error(function (data, status, headers, config) {
      $log.error('Failed to store state for user.');
    });
  };
  var getState = function () {
    return $http
    .get('/codeeditor/a/editorstate')
    .success(function (data, status, headers, config) {
      $log.debug('Retrieved state for user: ', data);
      return data;
    })
    .error(function (data, status, headers, config) {
      $log.error('Failed to retrieve state for user.');
    });
  };
  var state = getState();
  return {
    state: state,
    storeState: function () {
      storeState();
    },
    getState: function () {
      getState();
    }
  };
}]);
