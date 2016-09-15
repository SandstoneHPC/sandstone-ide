import os
import pwd
import unittest
import mock
import tornado.web
import tornado.websocket
import tornado.escape
from tornado.testing import gen_test
from tornado.websocket import websocket_connect
from tornado.httpclient import HTTPRequest
from sandstone.lib.test_utils import TestHandlerBase
from sandstone.lib.handlers.base import BaseHandler
from sandstone.lib.broadcast.manager import BroadcastManager
from sandstone.lib.broadcast.handlers import BroadcastHandler


EXEC_USER = pwd.getpwuid(os.getuid())[0]

class BroadcastHandlerTestCase(TestHandlerBase):
    def setUp(self):
        request = mock.Mock()
        reqh = tornado.web.RequestHandler(self.get_app(),request)
        reqh.set_secure_cookie('user',EXEC_USER)
        cookie = reqh._new_cookie.get('user')
        self.auth_cookie = 'user="{}"'.format(cookie.value)
        super(BroadcastHandlerTestCase,self).setUp()

    @gen_test
    def test_send_message(self):
        msg = {
          'key': 'test:test_msg',
          'data': {
              'test': 'test'
          }
        }
        msg_json = tornado.escape.json_encode(msg)

        ws = yield websocket_connect(
            HTTPRequest(
                'ws://localhost:%d/messages' % self.get_http_port(),
                headers={'Cookie':self.auth_cookie}),
            io_loop=self.io_loop)
        ws.write_message(msg_json)
        response = yield ws.read_message()
        self.assertIn(msg_json, response)

class BroadcastManagerTestCase(TestHandlerBase):
    def setUp(self):
        BroadcastManager._clients = set()
        super(BroadcastManagerTestCase,self).setUp()

    def test_add_client(self):
        request = mock.Mock()
        client1 = BroadcastHandler(self.get_app(),request)
        client2 = BroadcastHandler(self.get_app(),request)
        invalid_client = BaseHandler(self.get_app(),request)

        self.assertEqual(BroadcastManager._clients,set())
        BroadcastManager.add_client(client1)
        self.assertEqual(BroadcastManager._clients,set([client1]))
        BroadcastManager.add_client(client2)
        self.assertEqual(BroadcastManager._clients,set([client1,client2]))
        with self.assertRaises(TypeError):
            BroadcastManager.add_client(invalid_client)

    def test_remove_client(self):
        request = mock.Mock()
        client1 = BroadcastHandler(self.get_app(),request)
        client2 = BroadcastHandler(self.get_app(),request)
        client3 = BroadcastHandler(self.get_app(),request)
        BroadcastManager.add_client(client1)
        BroadcastManager.add_client(client2)

        BroadcastManager.remove_client(client3)
        self.assertEqual(BroadcastManager._clients,set([client1,client2]))
        BroadcastManager.remove_client(client1)
        self.assertEqual(BroadcastManager._clients,set([client2]))
        BroadcastManager.remove_client(client2)
        self.assertEqual(BroadcastManager._clients,set())
        BroadcastManager.remove_client(client2)
        self.assertEqual(BroadcastManager._clients,set())

    @mock.patch.object(BroadcastHandler,'write_message')
    def test_broadcast(self,m):
        request = mock.Mock()
        client1 = BroadcastHandler(self.get_app(),request)
        client2 = BroadcastHandler(self.get_app(),request)
        msg = tornado.escape.json_encode({'key':'test:test_msg','data':{}})

        BroadcastManager.broadcast(msg)
        self.assertFalse(m.called)

        m.reset_mock()
        BroadcastManager.add_client(client1)
        BroadcastManager.broadcast(msg)
        self.assertEqual(m.call_count,1)
        m.assert_called_with(msg)

        m.reset_mock()
        BroadcastManager.add_client(client2)
        BroadcastManager.broadcast(msg)
        self.assertEqual(m.call_count,2)
        m.assert_called_with(msg)

        m.reset_mock()
        invalid_msg = tornado.escape.json_encode({'key':'test:test_msg'})
        with self.assertRaises(ValueError):
            BroadcastManager.broadcast(invalid_msg)
        self.assertFalse(m.called)
