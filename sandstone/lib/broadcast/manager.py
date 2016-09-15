import tornado.websocket
import tornado.escape
from sandstone.lib.broadcast.message import BroadcastMessage



class BroadcastManager(object):
    """
    Manages a set of Websocket clients. Adds/Removes clients, and broadcasts messages
    """
    _clients = set()

    @classmethod
    def add_client(cls, client):
        if not isinstance(client,tornado.websocket.WebSocketHandler):
            raise TypeError('Client is not a subclass of WebSocketHandler')
        cls._clients.add(client)

    @classmethod
    def broadcast(cls, message):
        if not isinstance(message, BroadcastMessage):
            raise TypeError("message must be an instance of BroadcastMessage.")

        json_msg = message.to_json_string()
        for client in cls._clients:
            try:
                client.write_message(json_msg)
            except:
                # TODO handle custom exception
                pass

    @classmethod
    def remove_client(cls, client):
        if client and (client in cls._clients):
            cls._clients.remove(client)
