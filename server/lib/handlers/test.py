import os
import datetime
import tornado.web
import tornado.websocket
from lib.handlers.base import BaseHandler
from lib.mixins.db_mixin import DBMixin



# class TestHandler(BaseHandler, DBMixin):
    
#     @tornado.web.authenticated
#     def get(self):
#         self.render('lib/templates/test.html')
            

class TestHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "WebSocket opened"

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print "WebSocket closed"
