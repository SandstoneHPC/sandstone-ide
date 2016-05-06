import unittest
import mock
import os

from tornado.web import StaticFileHandler
import oide
from oide.app import OIDEApplication
from oide.lib import ui_methods
from oide.lib.handlers.main import MainHandler
from oide.lib.handlers.pam_auth import PAMLoginHandler
from oide import settings as default_settings



INSTALLED_APPS = (
    'oide.lib',
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
)
APP_SPECS = []
for mod_name in ['oide.apps.codeeditor.settings','oide.apps.filebrowser.settings']:
    mod = __import__(mod_name,fromlist=[''])
    APP_SPECS.append(mod.APP_SPECIFICATION)

class MainAppTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    @mock.patch('oide.settings.APP_SPECIFICATIONS',APP_SPECS)
    def setUp(self):
        self.app = OIDEApplication()

    def test_app_settings(self):
        self.assertEqual(type(self.app.settings),type({}))

        expd = dict(
            project_dir=oide.__path__[0],
            static_dir=os.path.join(oide.__path__[0],'client/oide'),
            login_url=default_settings.LOGIN_URL,
            cookie_secret = default_settings.COOKIE_SECRET,
            debug = default_settings.DEBUG,
            xsrf_cookies=True,
            ui_methods=ui_methods,
        )
        self.assertDictContainsSubset(expd,self.app.settings)

    def test_app_handlers(self):
        handlers = self.app.handlers[0][1]
        hpaths = [h._path for h in handlers]

        self.assertEqual(handlers[0]._path,'/static/core/%s')
        self.assertTrue(issubclass(handlers[0].handler_class,StaticFileHandler))

        self.assertTrue('/' in hpaths)
        i = hpaths.index('/')
        self.assertTrue(issubclass(handlers[i].handler_class,MainHandler))
        self.assertTrue('/auth/login' in hpaths)
        i = hpaths.index('/auth/login')
        self.assertTrue(issubclass(handlers[i].handler_class,PAMLoginHandler))
        self.assertTrue('/auth/logout' in hpaths)
        self.assertTrue('/a/deps' in hpaths)
        self.assertTrue('/static/editor/%s' in hpaths)
        self.assertTrue('/static/filebrowser/%s' in hpaths)
        self.assertTrue('/filebrowser/localfiles%s' in hpaths)
        self.assertTrue('/filebrowser/filetree/a/dir' in hpaths)
