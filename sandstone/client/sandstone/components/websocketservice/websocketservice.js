/**
  * @module sandstone.WebsocketService
  * This service is a very thin wrapper around the default
  * JS Websockets API. This module exists so that websocket
  * connections can be mocked under test.
  */
'use strict';

angular.module('sandstone.websocketservice', [])
.factory('WebsocketService', [function() {
  return {
    /**
      * @function connect
      * @param {string} url The full URL of the Websocket to connect to
      * @returns {object} ws The established websocket connection
      */
    connect: function(url) {
      // In case I forget to remove this: This is only for test
      if (url === 'ws://server:80/messages') {
        return {};
      }
      var ws = new WebSocket(url);
      return ws;
    }
  };
}]);
