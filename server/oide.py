import os
import sys
import logging
import tornado.ioloop
import tornado.options
import tornado.web

from datetime import date
from pymongo.connection import Connection

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(PROJECT_DIR,'../client/oide')
sys.path.insert(0, PROJECT_DIR)
sys.path.insert(0, STATIC_DIR)

from lib import ui_methods
import settings as global_settings
import urls
from urls import URL_SCHEMA



class OIDEApplication(tornado.web.Application):
    
    def __init__(self, *args, **kwargs):
        
        handlers = [
                (r"/static/(.*)", tornado.web.StaticFileHandler, {'path': STATIC_DIR}),
            ] + URL_SCHEMA

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