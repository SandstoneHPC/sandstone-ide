function getSandstoneModule(depList) {
  return angular.module('sandstone', depList)
    .config(['$urlRouterProvider','$httpProvider', function($urlRouterProvider,$httpProvider) {
      $httpProvider.interceptors.push('XsrfInjector');
      $httpProvider.interceptors.push('AuthInjector');
      $urlRouterProvider.otherwise('/editor');
    }])
    .run(function(BroadcastService) {
        // Loads the BroadcastService
        BroadcastService.initialize();
    })
    .factory('XsrfInjector',[function() {
      var getCookie = function(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
      };
      return {
        request: function(config) {
          config.headers['X-XSRFToken'] = getCookie('_xsrf');
          return config;
        }
      };
    }])
    .factory('AuthInjector', ['$q','$window','$location',function($q,$window,$location) {
      return {
        'responseError': function(rejection) {
          if(rejection.status === 403) {
            var next = $location.path();
            $window.location = '/auth/login?next=%2F#' + next;
          }
          return $q.reject(rejection);
        }
      };
    }])
    .controller('PageCtrl', ['$location','PageService',function($location,PageService) {
      var self = this;
      self.currentUrl = PageService.getCurrentUrl;
    }])
    .factory('PageService', ['$location',function($location) {
      return {
        getCurrentUrl: function () {
          return '/#'+$location.path();
        }
      };
    }])
    .service('AlertService',[function() {
      var self = this;
      var alerts = {};

      function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
      };

      self.getAlerts = function() {
        return alerts;
      };

      self.addAlert = function(alertParams) {
        var close = true;
        if('close' in alertParams) {
          close = alertParams.close;
        }
        // Make a unique identifier for this alert so
        // it can be referenced and modified later.
        var uuid = generateUUID();
        var alert = {
          type: alertParams.type,
          message: alertParams.message,
          close: close
        };
        alerts[uuid] = alert;
        return uuid;
      };

      self.removeAlert = function(uuid) {
        if(uuid in alerts) {
          delete alerts[uuid];
        }
      };

    }]);
}
