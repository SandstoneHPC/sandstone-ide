import os
import pwd
import urllib
import mock
import json
import tempfile
import shutil
from oide.lib.handlers.base import BaseHandler
from oide.lib.test_utils import TestHandlerBase

from oide.apps.filebrowser.handlers import LocalFileHandler



EXEC_USER = pwd.getpwuid(os.getuid())[0]


class LocalFileHandlerTestCase(TestHandlerBase):
    def setUp(self,*args,**kwargs):
        self.test_dir = tempfile.mkdtemp()
        super(LocalFileHandlerTestCase,self).setUp(*args,**kwargs)

    def tearDown(self,*args,**kwargs):
        shutil.rmtree(self.test_dir)
        super(LocalFileHandlerTestCase,self).tearDown(*args,**kwargs)

    def test_get_unauthed(self):
        response = self.fetch(
            '/filebrowser/localfiles/tmp/test.txt',
            method='GET',
            follow_redirects=False)

        self.assertEqual(response.code, 302)
        self.assertTrue(response.headers['Location'].startswith('/auth/login?next=%2F'))

    # GET tests
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_authed(self,m):
        fp = os.path.join(self.test_dir,'testfile.txt')
        with open(fp,'w') as test_file:
            for line in ['test\n','test\ntest','test']:
                test_file.write(line)
        self.assertTrue(os.path.exists(fp))

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 200)

        r = json.loads(response.body)
        self.assertTrue('content' in r)
        self.assertEqual(r['content'],'test\ntest\ntesttest')

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_invalid_file(self,m):
        response = self.fetch(
            '/filebrowser/localfiles{}'.format('totallyfake'),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 404)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_priv_file(self,m):
        response = self.fetch(
            '/filebrowser/localfiles{}'.format('/etc/shadow'),
            method='GET',
            follow_redirects=False)
        self.assertEqual(response.code, 404)
        self.assertEqual(response.body,'')

    # POST tests
    def test_post_unauthed(self):
        fp = os.path.join(self.test_dir,'testfile.txt')
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='POST',
            body=urllib.urlencode({}),
            follow_redirects=False)

        self.assertFalse(os.path.exists(fp))

        self.assertEqual(response.code, 403)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_post_authed(self,m):
        post_args = {'isDir': True}
        dp = os.path.join(self.test_dir,'testdir')
        fp = os.path.join(self.test_dir,'testfile.txt')
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='POST',
            body=urllib.urlencode({}),
            follow_redirects=False)
        self.assertTrue(os.path.exists(fp))
        self.assertEqual(response.code, 200)

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(dp),
            method='POST',
            body=urllib.urlencode(post_args),
            follow_redirects=False)
        self.assertTrue(os.path.exists(dp))
        self.assertEqual(response.code, 200)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_post_bad_path(self,m):
        post_args = {'isDir': True}
        bad_dp = os.path.join(self.test_dir,'testdir','')
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(bad_dp[1:]),
            method='POST',
            body=urllib.urlencode(post_args),
            follow_redirects=False)
        self.assertEqual(response.code, 404)

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_post_exists(self,m):
        post_args = {}
        fp = os.path.join(self.test_dir,'testfile.txt')
        with open(fp,'w') as test_file:
            for line in ['test\n','test\ntest','test']:
                test_file.write(line)
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='POST',
            body=urllib.urlencode(post_args),
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        # Contents unchanged
        with open(fp,'r') as test_file:
            contents = test_file.readlines()
        self.assertEqual(contents,['test\n','test\n','testtest'])

    # PUT tests
    def test_put_unauthed(self):
        put_args = {'content': 'Hi!\n'}
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='PUT',
            body=json.dumps(put_args),
            follow_redirects=False)
        self.assertEqual(response.code, 403)

        with open(fp,'r') as test_file:
            test_cnt = test_file.read()
            self.assertEqual(test_cnt,'')

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_put_authed(self,m):
        put_args = {'content': 'Hi!\n'}
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='PUT',
            body=json.dumps(put_args),
            follow_redirects=False)
        self.assertEqual(response.code, 200)

        with open(fp,'r') as test_file:
            test_cnt = test_file.read()
            self.assertEqual(test_cnt,'Hi!\n')

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_put_bad_path(self,m):
        put_args = {'content': 'Hi!\n'}
        fp = os.path.join(self.test_dir,'testfile.txt')
        dp = os.path.join(self.test_dir,'testdir')
        os.mkdir(dp)

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='PUT',
            body=json.dumps(put_args),
            follow_redirects=False)
        self.assertEqual(response.code, 404)
        self.assertFalse(os.path.exists(fp))

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(dp),
            method='PUT',
            body=json.dumps(put_args),
            follow_redirects=False)
        self.assertEqual(response.code, 404)

    # DELETE tests
    def test_delete_unauthed(self):
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='DELETE',
            follow_redirects=False)
        self.assertEqual(response.code, 403)
        self.assertTrue(os.path.exists(fp))

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_delete_authed(self,m):
        dp = os.path.join(self.test_dir,'testdir')
        os.mkdir(dp)
        fp = os.path.join(self.test_dir,'testfile.txt')
        open(fp,'w').close()

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='DELETE',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        self.assertFalse(os.path.exists(fp))

        response = self.fetch(
            '/filebrowser/localfiles{}'.format(dp),
            method='DELETE',
            follow_redirects=False)
        self.assertEqual(response.code, 200)
        self.assertFalse(os.path.exists(dp))

    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_delete_bad_path(self,m):
        fp = os.path.join(self.test_dir,'testfile.txt')
        response = self.fetch(
            '/filebrowser/localfiles{}'.format(fp),
            method='DELETE',
            follow_redirects=False)
        self.assertEqual(response.code, 404)
        self.assertFalse(os.path.exists(fp))
