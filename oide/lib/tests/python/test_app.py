import unittest
import mock
from oide.app import OIDEApplication



INSTALLED_APPS = (
    'oide.lib',
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
    'oide.apps.webterminal',
)

class MainAppTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def setUp(self):
        self.app = OIDEApplication()

    def test_app_settings(self):
        self.assertEqual(type(self.app.settings),type({}))
