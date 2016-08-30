import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from pydispatch import dispatcher

class UpdateHandler(tornado.websocket.WebSocketHandler):
    """
    Used to receive and send messages to connected apps
    """
    def on_message(self, message):
        print message
        # write message back
        self.write_message(message)
        # get the event from the message
        message_info = json.loads(message)
        event = message_info['key']
        data = message_info['data']
        dispatcher.send(signal=event, sender=data)
