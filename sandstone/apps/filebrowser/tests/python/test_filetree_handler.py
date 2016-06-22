import os
import pwd
import urllib
import mock
import json
import tempfile
import shutil
import stat
import subprocess
from sandstone.lib.handlers.base import BaseHandler
from sandstone.lib.test_utils import TestHandlerBase

from sandstone.apps.filebrowser.handlers import FileTreeHandler



EXEC_USER = pwd.getpwuid(os.getuid())[0]
ROOTS = (
    '/tmp/test/',
    '/testdir/',
)


class FileTreeHandlerTestCase(TestHandlerBase):
    def setUp(self,*args,**kwargs):
        self.test_dir = tempfile.mkdtemp()
        super(FileTreeHandlerTestCase,self).setUp(*args,**kwargs)

    def tearDown(self,*args,**kwargs):
        shutil.rmtree(self.test_dir)
        super(FileTreeHandlerTestCase,self).tearDown(*args,**kwargs)

    def test_get_unauthed(self):
        response = self.fetch(
            '/filebrowser/filetree/a/dir',
            method='GET',
            follow_redirects=False)

        self.assertEqual(response.code, 302)
        self.assertTrue(response.headers['Location'].startswith('/auth/login?next=%2F'))

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_dirpath(self,m):
        roots = (
            '/tmp/test/',
            self.test_dir,
        )
        subdir = os.path.join(self.test_dir,'subdir','')
        os.mkdir(subdir)
        with mock.patch('sandstone.settings.FILESYSTEM_ROOT_DIRECTORIES',roots):
            response = self.fetch(
                '/filebrowser/filetree/a/dir',
                method='GET',
                follow_redirects=False)
            res = json.loads(response.body)
            self.assertEqual(response.code, 200)
            expd = [
                {
                    u'filename': u'/tmp/test/',
                    u'type': u'dir',
                    u'filepath': u'/tmp/test/',
                }, {
                    u'filename': self.test_dir,
                    u'type': u'dir',
                    u'filepath': self.test_dir,
                },
            ]
            self.assertListEqual(expd,res)

            params = {
                'dirpath': self.test_dir,
            }
            response = self.fetch(
                '/filebrowser/filetree/a/dir?{}'.format(urllib.urlencode(params)),
                method='GET',
                follow_redirects=False)
            res = json.loads(response.body)
            self.assertEqual(response.code, 200)
            expd = [
                {
                    u'group': EXEC_USER,
                    u'filepath': subdir,
                    u'is_accessible': True,
                    u'perm_string': u'775',
                    u'perm': u'drwxrwxr-x',
                    u'filename': u'subdir',
                    u'owner': EXEC_USER,
                    u'type': u'dir',
                    u'size': u'4.0 KiB'
                },
            ]
            self.assertListEqual(expd,res)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_folders(self,m):
        roots = (
            '/tmp/test/',
            self.test_dir,
        )
        subdir = os.path.join(self.test_dir,'subdir','')
        os.mkdir(subdir)
        with mock.patch('sandstone.settings.FILESYSTEM_ROOT_DIRECTORIES',roots):
            params = {
                'folders': 'true',
            }
            response = self.fetch(
                '/filebrowser/filetree/a/dir?{}'.format(urllib.urlencode(params)),
                method='GET',
                follow_redirects=False)
            res = json.loads(response.body)
            self.assertEqual(response.code, 200)
            expd = [
                {
                    u'filename': u'/tmp/test/',
                    u'type': u'dir',
                    u'filepath': u'/tmp/test/',
                }, {
                    u'filename': self.test_dir,
                    u'type': u'dir',
                    u'filepath': self.test_dir,
                },
            ]
            self.assertListEqual(expd,res)

            params = {
                'folders': 'true',
                'dirpath': self.test_dir,
            }
            response = self.fetch(
                '/filebrowser/filetree/a/dir?{}'.format(urllib.urlencode(params)),
                method='GET',
                follow_redirects=False)
            res = json.loads(response.body)
            self.assertEqual(response.code, 200)
            expd = [
                {
                    u'group': EXEC_USER,
                    u'filepath': subdir,
                    u'is_accessible': True,
                    u'perm_string': u'775',
                    u'perm': u'drwxrwxr-x',
                    u'filename': u'subdir',
                    u'type': u'dir',
                    u'size': u'4.0 KiB'
                },
            ]
            self.assertListEqual(expd,res)
