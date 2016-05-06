import unittest
import mock
import os
import tempfile

import oide.global_settings as global_settings
from oide import SettingsLoader



class SettingsLoaderTestCase(unittest.TestCase):
    def setUp(self):
        self.settings_dict = {
            'INSTALLED_APPS': (
                'oide.lib',
                'oide.apps.codeeditor',
                'oide.apps.filebrowser',
            ),
            'USE_SSL': True,
        }
        with open('/tmp/oide_settings.py','w+') as settings_file:
            self.local_settings = settings_file.name
            for k,v in self.settings_dict.iteritems():
                settings_file.write('{} = {}\n'.format(k,v))

    def tearDown(self):
        os.remove(self.local_settings)

    @mock.patch('os.environ',{})
    def test_settings_init_default(self):
        settings = SettingsLoader()
        self.assertEqual(settings.INSTALLED_APPS,global_settings.INSTALLED_APPS)
        self.assertEqual(settings.USE_SSL,global_settings.USE_SSL)
        self.assertEqual(len(settings.APP_SPECIFICATIONS),3)
        self.assertFalse(hasattr(settings,'APP_SPECIFICATION'))

    def test_settings_init_modified(self):
        with mock.patch('os.environ',{'OIDE_SETTINGS': self.local_settings}):
            settings = SettingsLoader()
            self.assertEqual(settings.INSTALLED_APPS,self.settings_dict['INSTALLED_APPS'])
            self.assertEqual(settings.USE_SSL,self.settings_dict['USE_SSL'])
            self.assertEqual(len(settings.APP_SPECIFICATIONS),2)
            self.assertFalse(hasattr(settings,'APP_SPECIFICATION'))

    @mock.patch('os.environ',{})
    def test_load_settings(self):
        settings = SettingsLoader()
        for s in ['USE_SSL','LOGIN_URL','COOKIE_SECRET']:
            delattr(settings,s)
        self.assertFalse(hasattr(settings,'USE_SSL'))
        self.assertFalse(hasattr(settings,'LOGIN_URL'))
        self.assertFalse(hasattr(settings,'COOKIE_SECRET'))

        settings._load_settings(global_settings,ignorelist=['USE_SSL','LOGIN_URL'])
        self.assertTrue(hasattr(settings,'COOKIE_SECRET'))
        self.assertEqual(settings.COOKIE_SECRET,global_settings.COOKIE_SECRET)
