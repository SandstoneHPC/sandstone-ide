import tornado.ioloop
import tornado.web
import tornado.websocket

class UpdateHandler(tornado.websocket.WebSocketHandler):
    """
    Used to receive and send messages to connected apps
    """
    def on_message(self, message):
        print message
        # write message back
        self.write_message(message)
