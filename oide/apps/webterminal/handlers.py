import tornado.web


import oide.apps.webterminal.settings as app_settings
from oide.lib.handlers.base import BaseHandler



class EmbedTerminalHandler(BaseHandler):

    @tornado.web.authenticated
    def get(self):
            ctx = {
                'shellinabox_url': app_settings.SHELLINABOX_URL
                }
            self.write(ctx)
