import unittest
import mock

from oide.lib.ui_methods import get_app_descriptions
from oide.lib.ui_methods import get_ng_module_spec



INSTALLED_APPS = (
    'oide.lib',
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
    'oide.apps.webterminal',
)

class GetAppDescriptionTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def test_get_default_desc(self):
        desc = get_app_descriptions()
        self.assertEqual(len(desc),3)
        self.assertEqual(type(desc),type([]))
        d = desc[0]
        self.assertEqual(type(d),type({}))
        self.assertIn('link',d)
        self.assertIn('name',d)
        self.assertIn('description',d)
        self.assertTrue(d['link'].startswith('/#/'))

    def test_get_modified_desc(self):
        installed_apps = (
            'oide.lib',
        )
        with mock.patch('oide.settings.INSTALLED_APPS', installed_apps):
            desc = get_app_descriptions()
            self.assertEqual(len(desc),0)
            self.assertEqual(type(desc),type([]))

class GetNgModuleSpecTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def test_get_default_ng_specs(self):
        specs = get_ng_module_spec()
        self.assertEqual(len(specs),3)
        self.assertEqual(type(specs),type([]))
        d = specs[0]
        self.assertEqual(type(d),type({}))
        self.assertIn('module_name',d)
        self.assertIn('stylesheets',d)
        self.assertIn('scripts',d)

    def test_get_modified_ng_specs(self):
        installed_apps = (
            'oide.lib',
        )
        with mock.patch('oide.settings.INSTALLED_APPS', installed_apps):
            specs = get_ng_module_spec()
            self.assertEqual(len(specs),0)
            self.assertEqual(type(specs),type([]))
