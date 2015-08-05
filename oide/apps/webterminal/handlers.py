import tornado.web


import oide.lib.decorators
import oide.apps.webterminal.settings as app_settings
from oide.lib.handlers.base import BaseHandler



class TerminalPageHandler(tornado.web.RequestHandler):
    def get(self, term_name):
        return None

class NewTerminalHandler(tornado.web.RequestHandler):
    def get(self):
        name, terminal = self.application.settings['term_manager'].new_named_terminal()
        ctx = {
            'term_name': name
            }
        self.write(ctx)
