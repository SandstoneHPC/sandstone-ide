import unittest
import mock
import urllib
import functools
import json
import os
import pwd
import tornado.testing
from tornado.testing import AsyncHTTPTestCase
from sandstone.app import SandstoneApplication
from sandstone.lib.handlers.base import BaseHandler
from sandstone.lib.test_utils import TestHandlerBase
from sandstone import settings

from sandstone.lib import app_loader



EXEC_USER = pwd.getpwuid(os.getuid())[0]
INSTALLED_APPS = settings.INSTALLED_APPS
APP_SPECS = settings.APP_SPECIFICATIONS
mod_app_specs = []
for mod_name in ['sandstone.apps.codeeditor.settings','sandstone.apps.filebrowser.settings']:
    mod = __import__(mod_name,fromlist=[''])
    mod_app_specs.append(mod.APP_SPECIFICATION)



# This test case covers the DependencyHandler, which is used by
# the client application during bootstrap to inject core/app
# dependencies.
class DependencyHandlerTestCase(TestHandlerBase):
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_deps(self,m):
        response = self.fetch(
            '/a/deps',
            method='GET'
        )
        self.assertEqual(response.code, 200)
        r = json.loads(response.body)
        self.assertTrue('dependencies' in r)
        self.assertEqual(type(r['dependencies']),type([]))

    @mock.patch('sandstone.settings.APP_SPECIFICATIONS',mod_app_specs)
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_modified_deps(self,m):
        response = self.fetch(
            '/a/deps',
            method='GET'
        )
        self.assertEqual(response.code, 200)
        expd = {
            "dependencies": [
                "editor",
                "filebrowser",
            ]
        }
        act = json.loads(response.body)
        self.assertDictEqual(act,expd)

class GetAppStaticSpecTestCase(unittest.TestCase):
    def test_get_default_static_specs(self):
        specs = app_loader.get_installed_app_static_specs()
        self.assertEqual(len(specs),len(APP_SPECS))
        self.assertEqual(type(specs),type([]))
        self.assertEqual(type(specs[0]),type(()))
        sdir_cmp = specs[0][1].split('/')
        self.assertEqual(sdir_cmp[-1],'static')
        # Test if abspath
        self.assertEqual(sdir_cmp[0],'')
        self.assertEqual(specs[0][0],mod_app_specs[0]['NG_MODULE_NAME'])

    @mock.patch('sandstone.settings.APP_SPECIFICATIONS',mod_app_specs)
    def test_get_modified_static_specs(self):
        specs = app_loader.get_installed_app_static_specs()
        self.assertEqual(len(specs),2)
        self.assertEqual(type(specs),type([]))

class GetAppUrlTestCase(unittest.TestCase):
    def test_get_default_urls(self):
        specs = app_loader.get_installed_app_urls()
        self.assertEqual(type(specs),type([]))
        self.assertEqual(type(specs[0]),type(()))
        self.assertEqual(type(specs[0][0]),type(''))
        self.assertTrue(issubclass(specs[0][1],BaseHandler))
