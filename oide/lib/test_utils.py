from tornado.testing import AsyncHTTPTestCase
from tornado.testing import LogTrapTestCase
from oide.app import OIDEApplication



APP = OIDEApplication()
APP.settings['xsrf_cookies'] = False

class TestHandlerBase(AsyncHTTPTestCase, LogTrapTestCase):
    def get_app(self):
        return APP
