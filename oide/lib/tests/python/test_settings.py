import unittest
import mock
import os
import tempfile

import oide.settings



class SettingsTestCase(unittest.TestCase):
    def setUp(self):
        with open('/tmp/oide_settings.py','w+') as settings_file:
            self.local_settings = settings_file.name
        self.settings_dict = {
            'INSTALLED_APPS': (
                'oide.lib',
                'oide.apps.codeeditor',
                'oide.apps.filebrowser',
            ),
            'USE_SSL': True,
        }

    def tearDown(self):
        os.remove(self.local_settings)

    def test_load_default_settings(self):
        with mock.patch('os.environ', {}):
            reload(oide.settings)
            installed_apps = (
                'oide.lib',
                'oide.apps.codeeditor',
                'oide.apps.filebrowser',
                'oide.apps.webterminal',
            )
            self.assertEqual(oide.settings.INSTALLED_APPS,installed_apps)
            self.assertFalse(oide.settings.USE_SSL)

    # def test_load_local_settings(self):
    #     with open(self.local_settings,'w') as settings_file:
    #         for k,v in self.settings_dict.iteritems():
    #             settings_file.write('{} = {}\n'.format(k,v))
    #     env = {
    #         'OIDE_SETTINGS': self.local_settings,
    #     }
    #     with mock.patch('os.environ', env):
    #         reload(oide.settings)
    #         self.assertEqual(oide.settings.INSTALLED_APPS,self.settings_dict['INSTALLED_APPS'])
    #         self.assertTrue(oide.settings.USE_SSL)
