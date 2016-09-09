import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.escape
import json
from pydispatch import dispatcher


class BroadcastManager(object):

    def __init__(self):
        self._clients = set()

    def add_client(self, client):
        self._clients.add(client)

    def broadcast(self, message):
        for client in self._clients:
            try:
                client.write_message(message)
            except:
                import pdb
                pdb.set_trace()

    def remove_client(self, client):
        if client:
            self._clients.remove(client)

class BroadcastHandler(tornado.websocket.WebSocketHandler):
    """
    Used to receive and send messages to connected apps
    """
    def open(self):
        broadcast_manager = self.application.broadcast_manager
        broadcast_manager.add_client(self)
    def on_message(self, message):
        # broadcast message
        self.application.broadcast_manager.broadcast(message)
        # get the event from the message
        message_info = tornado.escape.json_decode(message)
        event = message_info['key']
        data = message_info['data']
        dispatcher.send(signal=event, sender=data)

    def on_close(self):
        # remove the client from the list of clients
        broadcast_manager = self.application.broadcast_manager
        broadcast_manager.remove_client(self)
