import os
import pwd
import urllib
import mock
import json
import tempfile
import shutil
import subprocess
from oide.lib.handlers.base import BaseHandler
from oide.lib.test_utils import TestHandlerBase

from oide.apps.filebrowser.handlers import FilesystemUtilHandler



EXEC_USER = pwd.getpwuid(os.getuid())[0]


class FilesystemUtilHandlerTestCase(TestHandlerBase):
    def setUp(self,*args,**kwargs):
        self.test_dir = tempfile.mkdtemp()
        super(FilesystemUtilHandlerTestCase,self).setUp(*args,**kwargs)

    def tearDown(self,*args,**kwargs):
        shutil.rmtree(self.test_dir)
        super(FilesystemUtilHandlerTestCase,self).tearDown(*args,**kwargs)

    def test_get_unauthed(self):
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()
        params = {
            'operation':'CHECK_EXISTS',
            'filepath': fp,
        }
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)

        self.assertEqual(response.code, 302)
        self.assertTrue(response.headers['Location'].startswith('/auth/login?next=%2F'))

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_check_exists(self,m):
        dp = os.path.join(self.test_dir,'testDir')
        os.mkdir(dp)
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()
        dp_dne = os.path.join(self.test_dir,'testDirDNE')
        fp_dne = os.path.join(self.test_dir,'dne.txt')

        params = {
            'operation':'CHECK_EXISTS',
            'filepath': dp,
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        self.assertTrue(res['result'])

        params['filepath'] = fp

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        self.assertTrue(res['result'])

        params['filepath'] = fp_dne

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        self.assertFalse(res['result'])

        params['filepath'] = dp_dne

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        self.assertFalse(res['result'])

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_next_untitled_file(self,m):
        params = {
            'operation':'GET_NEXT_UNTITLED_FILE',
            'dirpath': self.test_dir,
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'Untitled1')
        self.assertEqual(res['result'],new_fp)

        fp = os.path.join(self.test_dir,'Untitled1')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'Untitled2')
        self.assertEqual(res['result'],new_fp)

        fp = os.path.join(self.test_dir,'Untitled1')
        open(fp,'w').close()
        fp = os.path.join(self.test_dir,'Untitled2')
        open(fp,'w').close()
        fp = os.path.join(self.test_dir,'Untitled4')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'Untitled3')
        self.assertEqual(res['result'],new_fp)

        fp = os.path.join(self.test_dir,'Untitled2')
        os.remove(fp)
        os.mkdir(fp)
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'Untitled3')
        self.assertEqual(res['result'],new_fp)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_next_untitled_dir(self,m):
        params = {
            'operation':'GET_NEXT_UNTITLED_DIR',
            'dirpath': self.test_dir,
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_dp = os.path.join(self.test_dir,'UntitledFolder1','')
        self.assertEqual(res['result'],new_dp)

        fp = os.path.join(self.test_dir,'Untitled1')
        dp = os.path.join(self.test_dir,'UntitledFolder1')
        os.mkdir(dp)
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_dp = os.path.join(self.test_dir,'UntitledFolder2','')
        self.assertEqual(res['result'],new_dp)

        dp = os.path.join(self.test_dir,'UntitledFolder2')
        os.mkdir(dp)
        dp = os.path.join(self.test_dir,'UntitledFolder4')
        os.mkdir(dp)
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_dp = os.path.join(self.test_dir,'UntitledFolder3','')
        self.assertEqual(res['result'],new_dp)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_next_duplicate(self,m):
        test_fp = os.path.join(self.test_dir,'testfile.txt')
        test_dp = os.path.join(self.test_dir,'testDir','')
        os.mkdir(test_dp)
        open(test_fp,'w').close()
        params = {
            'operation':'GET_NEXT_DUPLICATE',
            'filepath': test_dp,
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_dp = os.path.join(self.test_dir,'testDir-duplicate1','')
        self.assertEqual(res['result'],new_dp)

        params = {
            'operation':'GET_NEXT_DUPLICATE',
            'filepath': test_fp,
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'testfile.txt-duplicate1')
        self.assertEqual(res['result'],new_fp)

        fp = os.path.join(self.test_dir,'testfile.txt-duplicate1')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'testfile.txt-duplicate2')
        self.assertEqual(res['result'],new_fp)

        fp = os.path.join(self.test_dir,'testfile.txt-duplicate2')
        open(fp,'w').close()
        fp = os.path.join(self.test_dir,'testfile.txt-duplicate4')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        new_fp = os.path.join(self.test_dir,'testfile.txt-duplicate3')
        self.assertEqual(res['result'],new_fp)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_groups(self,m):
        params = {
            'operation':'GET_GROUPS',
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        expd = subprocess.check_output(["id", "--name", "-G"]).strip().split()
        self.assertEqual(res,expd)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_root_dir(self,m):
        test_dir = os.path.join(self.test_dir,'')
        with mock.patch('oide.settings.FILESYSTEM_ROOT_DIRECTORIES',('/tmp/',test_dir,)):
            fp = os.path.join(self.test_dir,'testfile.txt')
            params = {
                'operation':'GET_ROOT_DIR',
                'filepath': fp,
            }

            response = self.fetch(
                '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
                method='GET',
                follow_redirects=False)
            self.assertEqual(response.code, 200)
            res = json.loads(response.body)
            self.assertEqual(res['result'],'/tmp/')

        with mock.patch('oide.settings.FILESYSTEM_ROOT_DIRECTORIES',(test_dir,)):
            fp = os.path.join(self.test_dir,'testfile.txt')
            params = {
                'operation':'GET_ROOT_DIR',
                'filepath': fp,
            }

            response = self.fetch(
                '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
                method='GET',
                follow_redirects=False)
            self.assertEqual(response.code, 200)
            res = json.loads(response.body)
            self.assertEqual(res['result'],test_dir)

        params = {
            'operation':'GET_ROOT_DIR',
            'filepath': '/not/a/file',
        }

        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 500)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_volume_info(self,m):
        params = {
            'operation':'GET_VOLUME_INFO',
        }
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 400)

        params = {
            'operation':'GET_VOLUME_INFO',
            'filepath': self.test_dir,
        }
        response = self.fetch(
            '/filebrowser/a/fileutil?{}'.format(urllib.urlencode(params)),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        res = json.loads(response.body)
        df = subprocess.check_output(['df', self.test_dir]).strip().split()
        expd = {
            'percent': float(df[-2].strip('%')),
        }
        self.assertDictContainsSubset(expd,res['result'])
