import os
import pwd
import urllib
import mock
from oide.lib.handlers.base import BaseHandler
from oide.lib.test_utils import TestHandlerBase



EXEC_USER = pwd.getpwuid(os.getuid())[0]

class MainHandlerTestCase(TestHandlerBase):
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_authed(self,m):
        response = self.fetch(
            '/',
            method='GET',
            follow_redirects=False)

        # Use of angular routing on client-side means there should
        # be no redirection.
        self.assertEqual(response.code, 200)
        login_form = """<form action="/auth/login" method="POST" class="form-signin" role="form">"""
        self.assertNotIn(login_form,response.body)

    def test_get_unauthed(self):
        response = self.fetch(
            '/',
            method='GET',
            follow_redirects=False)

        self.assertEqual(response.code, 302)
        self.assertEqual(response.headers['Location'],'/auth/login?next=%2F')

    def test_get_unauthed_redirect(self):
        response = self.fetch(
            '/',
            method='GET')

        self.assertEqual(response.code, 200)
        login_form = """<form action="/auth/login" method="POST" class="form-signin" role="form">"""
        self.assertIn(login_form,response.body)

class BaseHandlerTestCase(TestHandlerBase):
    @mock.patch.object(BaseHandler,'get_secure_cookie',return_value=EXEC_USER)
    def test_get_current_user_authed(self,m):
        request = mock.Mock()
        handler = BaseHandler(self.get_app(),request)
        user = handler.get_current_user()
        self.assertEqual(user,EXEC_USER)

    def test_get_current_user_unauthed(self):
        request = mock.Mock()
        request.cookies = None
        handler = BaseHandler(self.get_app(),request)
        user = handler.get_current_user()
        self.assertEqual(user, None)

    def test_get_template_path(self):
        app = self.get_app()
        request = mock.Mock()
        handler = BaseHandler(app,request)
        tpath = handler.get_template_path()
        self.assertEqual(tpath,app.settings['project_dir'])
