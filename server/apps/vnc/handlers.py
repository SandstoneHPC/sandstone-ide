import tornado.web


import settings as global_settings
from lib.handlers.base import BaseHandler



class VncConfigHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
            ctx = {
                'host': global_settings.VNC_HOST,
                'port': global_settings.VNC_PORT,
                'password': global_settings.VNC_TEST_PASSWD
                }
            self.write(ctx)
