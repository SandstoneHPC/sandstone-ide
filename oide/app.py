import os
import sys
import re
import logging
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.httpserver

from datetime import date

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(PROJECT_DIR,'client/oide')

import settings as global_settings
# Set up sys.path for DEV mode, so that apps import
# from local copy of OIDE
if global_settings.DEV:
    module_path = os.path.abspath(os.path.join(PROJECT_DIR,'..'))
    sys.path.insert(0,module_path)
    # Add non-core apps to path
    for app in global_settings.DEV_APPS:
        if app[1]:
            sys.path.insert(0,app[1])

from lib import ui_methods
from lib.app_loader import get_installed_app_static_specs
import urls
from urls import URL_SCHEMA

class OIDEApplication(tornado.web.Application):

    def __init__(self, *args, **kwargs):
        app_static_handlers = []
        for spec in get_installed_app_static_specs():
            s_url = r"/static/{}/(.*)".format(spec[0])
            s_dir = os.path.join(spec[1],'static')
            app_static_handlers.append(
                (s_url, tornado.web.StaticFileHandler, {'path': s_dir})
            )

        handlers = [
                (r"/static/core/(.*)", tornado.web.StaticFileHandler, {'path': STATIC_DIR}),
            ] + app_static_handlers + URL_SCHEMA

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


def main():
    application = OIDEApplication()
    if global_settings.USE_SSL:
        ssl_server = tornado.httpserver.HTTPServer(application, ssl_options={
            "certfile": global_settings.SSL_CERT,
            "keyfile": global_settings.SSL_KEY,
        })
        ssl_server.listen(int(os.environ.get('OIDEPORT', 8888)))
    else:
        application.listen(int(os.environ.get('OIDEPORT', 8888)))
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
