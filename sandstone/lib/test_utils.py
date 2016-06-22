from tornado.testing import AsyncHTTPTestCase
from tornado.testing import LogTrapTestCase
from sandstone.app import SandstoneApplication



APP = SandstoneApplication()
APP.settings['xsrf_cookies'] = False

class TestHandlerBase(AsyncHTTPTestCase, LogTrapTestCase):
    def get_app(self):
        return APP
