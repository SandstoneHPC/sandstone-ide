import tornado.web


import settings as global_settings
from lib.handlers.base import BaseHandler



class EmbedTerminalHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
            ctx = {
                'shellinabox_url': global_settings.SHELLINABOX_URL
                }
            self.write(ctx)
