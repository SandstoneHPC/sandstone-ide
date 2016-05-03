import unittest
import mock
import urllib
import functools
import json
import os
import pwd
import tornado.testing
from tornado.testing import AsyncHTTPTestCase
from oide.app import OIDEApplication
from oide.lib.handlers.base import BaseHandler
from oide.lib.test_utils import TestHandlerBase

from oide.lib.app_loader import DependencyHandler
from oide.lib.app_loader import get_installed_app_specs
from oide.lib.app_loader import get_installed_app_static_specs
from oide.lib.app_loader import get_installed_app_urls



EXEC_USER = pwd.getpwuid(os.getuid())[0]
INSTALLED_APPS = (
    'oide.lib',
    'oide.apps.codeeditor',
    'oide.apps.filebrowser',
    'oide.apps.webterminal',
)

# This test case covers the DependencyHandler, which is used by
# the client application during bootstrap to inject core/app
# dependencies.
class DependencyHandlerTestCase(TestHandlerBase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_default_deps(self,m):
        response = self.fetch(
            '/a/deps',
            method='GET'
        )
        self.assertEqual(response.code, 200)
        expd = {
            "dependencies": [
                "editor",
                "filebrowser",
                "terminal"
            ]
        }
        act = json.loads(response.body)
        self.assertDictEqual(act,expd)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_modified_deps(self,m):
        installed_apps = (
            'oide.lib',
            'oide.apps.codeeditor',
            'oide.apps.filebrowser',
        )
        with mock.patch('oide.settings.INSTALLED_APPS', installed_apps):
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

class GetAppSpecsTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def test_get_default_app_specs(self):
        specs = get_installed_app_specs()
        self.assertEqual(len(specs),3)
        self.assertEqual(type(specs),type([]))
        self.assertEqual(type(specs[0]),type({}))
        self.assertIn('APP_DESCRIPTION',specs[0])
        self.assertIn('NG_MODULE_NAME',specs[0])
        self.assertIn('NG_MODULE_SCRIPTS',specs[0])

    def test_get_modified_app_specs(self):
        installed_apps = (
            'oide.lib',
            'oide.apps.codeeditor',
            'oide.apps.filebrowser',
        )
        with mock.patch('oide.settings.INSTALLED_APPS', installed_apps):
            specs = get_installed_app_specs()
            self.assertEqual(len(specs),2)
            self.assertEqual(type(specs),type([]))

class GetAppStaticSpecTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def test_get_default_static_specs(self):
        app_specs = get_installed_app_specs()
        specs = get_installed_app_static_specs()
        self.assertEqual(len(specs),3)
        self.assertEqual(type(specs),type([]))
        self.assertEqual(type(specs[0]),type(()))
        sdir_cmp = specs[0][1].split('/')
        self.assertEqual(sdir_cmp[-1],'static')
        # Test if abspath
        self.assertEqual(sdir_cmp[0],'')
        self.assertEqual(specs[0][0],app_specs[0]['NG_MODULE_NAME'])

    def test_get_modified_static_specs(self):
        installed_apps = (
            'oide.lib',
            'oide.apps.codeeditor',
            'oide.apps.filebrowser',
        )
        with mock.patch('oide.settings.INSTALLED_APPS', installed_apps):
            specs = get_installed_app_static_specs()
            self.assertEqual(len(specs),2)
            self.assertEqual(type(specs),type([]))

class GetAppUrlTestCase(unittest.TestCase):
    @mock.patch('oide.settings.INSTALLED_APPS',INSTALLED_APPS)
    def test_get_default_urls(self):
        specs = get_installed_app_urls()
        self.assertEqual(type(specs),type([]))
        self.assertEqual(type(specs[0]),type(()))
        self.assertEqual(type(specs[0][0]),type(''))
