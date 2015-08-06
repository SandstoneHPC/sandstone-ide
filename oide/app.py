import os
import sys
import logging
import tornado.ioloop
import tornado.options
import tornado.web

from datetime import date
from pymongo.connection import Connection
from terminado import TermSocket
from terminado import SingleTermManager

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(PROJECT_DIR,'client/oide')

from oide.lib import ui_methods
import oide.settings as global_settings
from oide.lib.app_loader import get_installed_app_static_specs
import oide.urls
from oide.urls import URL_SCHEMA



class OIDEApplication(tornado.web.Application):

    def __init__(self, *args, **kwargs):
        app_static_handlers = []
        for spec in get_installed_app_static_specs():
            s_url = r"/static/{}/(.*)".format(spec[0])
            s_dir = os.path.join(spec[1],'static')
            app_static_handlers.append(
                (s_url, tornado.web.StaticFileHandler, {'path': s_dir})
            )

        term_manager = SingleTermManager(shell_command=['bash'])
        self.term_manager = term_manager
        term_url = [(r"/terminal/a/term", TermSocket,
                     {'term_manager': term_manager})]

        handlers = [
                (r"/static/core/(.*)", tornado.web.StaticFileHandler, {'path': STATIC_DIR}),
            ] + app_static_handlers + URL_SCHEMA + term_url

        settings = dict(
            project_dir=PROJECT_DIR,
            static_dir=STATIC_DIR,
            login_url=global_settings.LOGIN_URL,
            cookie_secret = global_settings.COOKIE_SECRET,
            debug = global_settings.DEBUG,
            xsrf_cookies=True,
            ui_methods=ui_methods,
            )

        tornado.web.Application.__init__(self, handlers, **settings)

        self.conn = Connection(
            global_settings.MONGO_URI,
            global_settings.MONGO_PORT,
            )
        self.database = self.conn['oide']


def main():
    # tornado.options.parse_command_line()
    application = OIDEApplication()
    application.listen(int(os.environ.get('OIDEPORT', 8888)))
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
