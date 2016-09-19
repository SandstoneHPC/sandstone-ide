/** @module sandstone.BroadcastService
  * This service implements the client-side interface to the
  * Broadcast System. This service is instantiated in a .run()
  * block on the sandstone root module.
  */
'use strict';

angular.module('sandstone.broadcastservice', [])
.factory('BroadcastService', ['$rootScope','WebsocketService','$location', function($rootScope,WebsocketService,$location) {
  var ws = null;
  var setUpWebsocket = function() {
    var protocol = 'ws'
    if($location.protocol() === 'https') {
      protocol = 'wss';
    }
    var websocketAddress = protocol + '://' + $location.host() + ':' + $location.port() + '/messages';
    ws = WebsocketService.connect(websocketAddress);
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
    /**
      * @function sendMessage
      * @param {object} The message to be broadcasted. Must have a key {string}
      * and data {object} defined.
      */
    sendMessage: sendMessage
  }
}]);
