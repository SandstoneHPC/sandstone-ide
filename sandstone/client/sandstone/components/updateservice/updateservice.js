angular.module('sandstone.updateservice', [])
.factory('UpdateService', ['$rootScope', function($rootScope){
    var ws = null;
    var setUpWebsocket = function() {
        // TODO find better way to create WS address
        if(window.location.protocol === 'https:') {
            protocol = 'wss://';
        } else {
            protocol = 'ws://';
        }
        var websocketAddress = protocol + window.location.hostname + ':' + window.location.port + '/messages';
        ws = new WebSocket(websocketAddress);
        ws.onmessage = function(e) {
            // TODO do something on receiving message
            console.log(JSON.parse(e.data));
        };
    };

    var sendMessage = function(message) {
        if(message) {
            ws.send(JSON.stringify(message));
        }
    };
    setUpWebsocket();
    return {
        sendMessage: sendMessage
    }
}]);
