import tornado.web


import oide.apps.vnc.settings as app_settings
from oide.lib.handlers.base import BaseHandler



class VncConfigHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
            ctx = {
                'host': app_settings.VNC_HOST,
                'port': app_settings.VNC_PORT,
                }
            self.write(ctx)
