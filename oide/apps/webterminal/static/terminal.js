'use strict';

angular.module('oide.terminal', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: '/static/terminal/terminal.html',
    controller: 'TerminalCtrl'
  });
}])

.factory('TerminalService', ['$http', function ($http) {

}])
.controller('TerminalCtrl', ['$scope','$window','$log', function($scope,$window,$log) {
  var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
  var ws_url = protocol+"://"+window.location.host+ "/terminal/a/term";

  function calculate_size(element) {
    var rows = Math.max(2, Math.floor(element.offsetHeight/15)-1);
    var cols = Math.max(3, Math.floor(element.offsetWidth/7)-1);
    return {rows: rows, cols: cols};
  }
  var size = calculate_size(document.getElementById("terminal-pane"));
  var terminal = make_terminal(document.getElementById("terminal-pane"), size, ws_url);
  $window.onbeforeunload = function (term) { term.destroy() };
}]);
