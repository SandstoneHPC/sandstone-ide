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
.controller('TerminalCtrl', ['$scope', '$log', function($scope,$log) {
    var termRowHeight = 0.0 + 1.00*document.getElementById("dummy-screen").offsetHeight / 25;
    var termColWidth = 0.0 + (1.02*document.getElementById("dummy-screen-rows").offsetWidth / 80);
    document.getElementById("dummy-screen").setAttribute("style", "display: none");
    var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
    var ws_url = protocol+"://"+window.location.host+ "/terminal/a/_websocket/1";

    function calculate_size(element) {
        var rows = Math.max(2, Math.floor(element.innerHeight/termRowHeight)-1);
        var cols = Math.max(3, Math.floor(element.innerWidth/termColWidth)-1);
        console.log("resize:", termRowHeight, termColWidth, element.innerHeight,
                                        element.innerWidth, rows, cols);
        return {rows: rows, cols: cols};
    }
    var size = calculate_size(window);
    var terminal = make_terminal(document.body, size, ws_url);
}]);
