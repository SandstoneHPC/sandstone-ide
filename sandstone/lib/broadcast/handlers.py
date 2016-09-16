import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.escape
from pydispatch import dispatcher
import sandstone.lib.decorators
from sandstone.lib.handlers.base import BaseHandler
from sandstone.lib.broadcast.message import BroadcastMessage
from sandstone.lib.broadcast.manager import BroadcastManager

class BroadcastHandler(tornado.websocket.WebSocketHandler,BaseHandler):
    """
    Used to receive and send messages to connected apps
    """
    @sandstone.lib.decorators.authenticated
    def get(self, *args, **kwargs):
        # import pdb; pdb.set_trace()
        super(BroadcastHandler,self).get(*args,**kwargs)

    def open(self):
        BroadcastManager.add_client(self)

    def on_message(self, message):
        try:
            bmsg = BroadcastMessage.create_from_string(message)
        except BroadcastMessage.MessageValidationError:
            return
        # broadcast message
        BroadcastManager.broadcast(bmsg)
        # get the event from the message
        event = bmsg.key
        data = bmsg.data
        dispatcher.send(signal=event, sender=data)

    def on_close(self):
        # remove the client from the list of clients
        BroadcastManager.remove_client(self)
