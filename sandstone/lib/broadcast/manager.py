import tornado.websocket
import tornado.escape



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
        # Validate message
        msg = tornado.escape.json_decode(message)
        try:
            msg['key']
            msg['data']
        except KeyError:
            raise ValueError("Message must have 'key' and 'data' defined.")
        for client in cls._clients:
            try:
                client.write_message(message)
            except:
                # TODO handle custom exception
                pass

    @classmethod
    def remove_client(cls, client):
        if client and (client in cls._clients):
            cls._clients.remove(client)
