from tornado.testing import AsyncHTTPTestCase
from oide.app import OIDEApplication



APP = OIDEApplication()

class TestHandlerBase(AsyncHTTPTestCase):
    def get_app(self):
        return APP
