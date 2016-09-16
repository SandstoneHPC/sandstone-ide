angular.module('sandstone.broadcastservice', [])
.factory('BroadcastService', ['$rootScope','$websocket','$location', function($rootScope,$websocket,$location) {
  var ws = null;
  var setUpWebsocket = function() {
    var protocol = 'ws'
    if($location.protocol() === 'https') {
      protocol = 'wss';
    }
    var websocketAddress = protocol + '://' + $location.host() + ':' + $location.port() + '/messages';
    ws = $websocket(websocketAddress);
    ws.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      $rootScope.$emit(data.key, data.data);
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
