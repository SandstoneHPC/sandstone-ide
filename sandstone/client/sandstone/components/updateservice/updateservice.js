angular.module('sandstone.updateservice', [])
.service('UpdateService', ['$rootScope', function($rootScope){
    var ws = null;
    var setUpWebsocket = function() {
        // TODO find better way to create WS address
        var websocketAddress = "ws://" + window.location.hostname + ":" + window.location.port + "/messages";
        ws = new WebSocket(websocketAddress);
        ws.onMessage = function(e) {
            // TODO do something on receiving message
            console.log(e.data);
        };
    };

    var sendMessage = function(message) {
        if(message) {
            ws.send(message);
        }
    };
    setUpWebsocket();
    return {
        sendMessage: sendMessage
    }
}]);
